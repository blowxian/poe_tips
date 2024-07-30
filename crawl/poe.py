import os
import praw
import psycopg2
from datetime import datetime, timezone
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

# 初始化 Reddit API 客户端
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

# 连接 PostgreSQL 数据库
conn = psycopg2.connect(os.getenv('PY_DATABASE_URL'))
cursor = conn.cursor()

def fetch_and_store_posts():
    subreddit = reddit.subreddit(os.getenv('SUBREDDIT'))
    hot_posts = subreddit.hot(limit=100)  # 可以调整 limit 来控制获取的数量

    for post in hot_posts:
        reddit_id = post.id
        title = post.title
        content = post.selftext
        subreddit_name = post.subreddit.display_name
        author = post.author.name if post.author else None
        score = post.score
        upvote_ratio = post.upvote_ratio
        num_comments = post.num_comments
        permalink = post.permalink
        created_utc = datetime.fromtimestamp(post.created_utc, timezone.utc)
        url = post.url
        now = datetime.now(timezone.utc)  # 使用当前时间作为 updatedAt

        cursor.execute("SELECT 1 FROM \"Post\" WHERE \"redditId\" = %s", (reddit_id,))
        exists = cursor.fetchone()

        if not exists:
            cursor.execute(
                """
                INSERT INTO "Post" (
                    "redditId", "title", "content", "subreddit", "author", "score",
                    "upvoteRatio", "numComments", "permalink", "createdUtc", "url",
                    "createdAt", "updatedAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (reddit_id, title, content, subreddit_name, author, score,
                 upvote_ratio, num_comments, permalink, created_utc, url, created_utc, now)
            )
        else:
            cursor.execute(
                """
                UPDATE "Post" SET
                    "title" = %s, "content" = %s, "subreddit" = %s, "author" = %s,
                    "score" = %s, "upvoteRatio" = %s, "numComments" = %s,
                    "permalink" = %s, "createdUtc" = %s, "url" = %s, "updatedAt" = %s
                WHERE "redditId" = %s
                """,
                (title, content, subreddit_name, author, score, upvote_ratio, num_comments,
                 permalink, created_utc, url, now, reddit_id)
            )
        conn.commit()
        fetch_and_store_comments(reddit_id)

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

        cursor.execute("SELECT 1 FROM \"Comment\" WHERE \"redditId\" = %s", (comment_id,))
        exists = cursor.fetchone()

        if not exists:
            cursor.execute(
                """
                INSERT INTO "Comment" (
                    "redditId", "postId", "author", "content", "score", "createdUtc",
                    "createdAt", "updatedAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (comment_id, post_id, author, content, score, created_utc, created_utc, now)
            )
        else:
            cursor.execute(
                """
                UPDATE "Comment" SET
                    "postId" = %s, "author" = %s, "content" = %s, "score" = %s,
                    "createdUtc" = %s, "updatedAt" = %s
                WHERE "redditId" = %s
                """,
                (post_id, author, content, score, created_utc, now, comment_id)
            )
        conn.commit()

def main():
    fetch_and_store_posts()

if __name__ == "__main__":
    main()