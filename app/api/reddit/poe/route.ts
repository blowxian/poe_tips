import {NextRequest, NextResponse} from 'next/server';
import Snoowrap from 'snoowrap';

export async function GET(request: NextRequest) {
    const subreddit = 'pathofexile'; // 这里可以动态获取 subreddit 名称
    const limit = 10; // 限制获取的帖子的数量

    const r = new Snoowrap({
        userAgent: 'mac:POE tips:1.0 (by /u/lisonallen)',
        clientId: process.env.REDDIT_CLIENT_ID!,
        clientSecret: process.env.REDDIT_CLIENT_SECRET!,
        refreshToken: process.env.REDDIT_REFRESH_TOKEN!
    });

    try {
        const posts = await r.getSubreddit(subreddit).getHot({limit});

        console.log(posts);

        const data = posts.map(post => ({
            title: post.title,
            url: post.url,
            author: post.author.name
        }));

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error: (error as any).message}, {status: 500} as any);
    }
}