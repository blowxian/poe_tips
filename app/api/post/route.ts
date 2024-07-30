import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10; // 每页获取 10 条帖子
    const offset = (page - 1) * limit;

    try {
        const [posts, totalPosts] = await Promise.all([
            prisma.post.findMany({
                skip: offset,
                take: limit,
                include: {
                    comments: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            } as any),
            prisma.post.count(),
        ]);

        const hasMore = offset + posts.length < totalPosts;
        return NextResponse.json({posts, hasMore});
    } catch (error) {
        return NextResponse.json({error: 'Failed to fetch posts'}, {status: 500} as any);
    }
}
