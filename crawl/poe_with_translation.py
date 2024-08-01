import os
import praw
import psycopg2
from datetime import datetime, timezone
from dotenv import load_dotenv
from together import Together
import logging

# 设置日志配置
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# 加载环境变量
load_dotenv()

# 初始化 Reddit API 客户端
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)
logging.info("Reddit API 客户端初始化完成。")

# 连接 PostgreSQL 数据库
try:
    conn = psycopg2.connect(os.getenv('PY_DATABASE_URL'))
    cursor = conn.cursor()
    logging.info("数据库连接成功。")
except Exception as e:
    logging.error("数据库连接失败: %s", e)

def translate(text):
    client = Together()
    prompt = f"{text}"
    completion = client.chat.completions.create(
      model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages=[{
        "role": "system", "content": """
         你是一个专业的流放之路（POE, Path of Exile）游戏翻译专家，擅长翻译英文到中文，你要将我提供的英文内容翻译成中文，并使用游戏的专有名词。确保翻译后的内容准确反映游戏中的术语和专有名词。
         仅完成内容翻译，不要输出非翻译的内容
        """
      }, {"role": "user", "content": prompt}],
      stream=True
    )
    response = ""
    for chunk in completion:
        response += chunk.choices[0].delta.content or ""

    logging.info("%s 的翻译结果：%s", text, response)
    return response

def fetch_and_store_comments(reddit_id):
    cursor.execute("SELECT id FROM \"Post\" WHERE \"redditId\" = %s", (reddit_id,))
    post_id = cursor.fetchone()[0]

    post = reddit.submission(id=reddit_id)
    post.comments.replace_more(limit=None)
    for comment in post.comments.list():
        comment_id = comment.id
        author = comment.author.name if comment.author else None
        content = comment.body
        score = comment.score
        created_utc = datetime.fromtimestamp(comment.created_utc, timezone.utc)
        now = datetime.now(timezone.utc)  # 使用当前时间作为 updatedAt

        # 检查数据库中是否已有翻译内容
        cursor.execute("SELECT \"contentZh\" FROM \"Comment\" WHERE \"redditId\" = %s", (comment_id,))
        result = cursor.fetchone()
        if result and result[0]:
            translated_content = result[0]
        else:
            translated_content = translate(content)

        try:
            cursor.execute(
                """
                INSERT INTO "Comment" (
                    "redditId", "postId", "author", "content", "contentZh", "score", "createdUtc",
                    "createdAt", "updatedAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT ("redditId") DO UPDATE SET
                    "content" = EXCLUDED."content", "contentZh" = EXCLUDED."contentZh", "score" = EXCLUDED."score",
                    "updatedAt" = EXCLUDED."updatedAt"
                """,
                (comment_id, post_id, author, content, translated_content, score, created_utc, now, now)
            )
            conn.commit()
            logging.info("评论已存储或更新: %s", comment_id)
        except Exception as e:
            logging.error("数据库操作出错: %s", e)
            conn.rollback()

def fetch_and_store_posts():
    subreddit = reddit.subreddit(os.getenv('SUBREDDIT'))
    hot_posts = subreddit.hot(limit=3)
    logging.info("正在从 %s 获取热门帖子。", subreddit.display_name)

    for post in hot_posts:
        reddit_id = post.id
        title = post.title
        content = post.selftext
        score = post.score
        upvote_ratio = post.upvote_ratio
        num_comments = post.num_comments
        permalink = post.permalink
        created_utc = datetime.fromtimestamp(post.created_utc, timezone.utc)
        url = post.url
        now = datetime.now(timezone.utc)

        # 检查数据库中是否已有翻译内容
        cursor.execute("SELECT \"titleZh\", \"contentZh\" FROM \"Post\" WHERE \"redditId\" = %s", (reddit_id,))
        result = cursor.fetchone()
        if result:
            translated_title, translated_content = result
        else:
            translated_title = translate(title)
            translated_content = translate(content)

        logging.info("处理帖子: %s", reddit_id)

        try:
            cursor.execute(
                """
                INSERT INTO "Post" (
                    "redditId", "title", "content", "titleZh", "contentZh",
                    "subreddit", "author", "score", "upvoteRatio", "numComments",
                    "permalink", "createdUtc", "url", "createdAt", "updatedAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT ("redditId") DO UPDATE SET
                    "title" = EXCLUDED."title", "content" = EXCLUDED."content", "titleZh" = EXCLUDED."titleZh",
                    "contentZh" = EXCLUDED."contentZh", "score" = EXCLUDED."score", "upvoteRatio" = EXCLUDED."upvoteRatio",
                    "numComments" = EXCLUDED."numComments", "updatedAt" = EXCLUDED."updatedAt"
                """,
                (reddit_id, title, content, translated_title, translated_content, post.subreddit.display_name,
                 post.author.name if post.author else None, score, upvote_ratio, num_comments, permalink,
                 created_utc, url, now, now)
            )
            conn.commit()
            logging.info("帖子已存储或更新: %s", reddit_id)
        except Exception as e:
            logging.error("数据库操作出错: %s", e)
            conn.rollback()

        # Fetch and store comments for the current post
        fetch_and_store_comments(reddit_id)

def main():
    fetch_and_store_posts()

if __name__ == "__main__":
    main()