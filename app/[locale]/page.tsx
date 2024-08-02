"use client";

import {useCallback, useEffect, useRef, useState} from 'react';
import {usePostStore} from './store';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faArrowUpRightFromSquare,
    faClock,
    faComments,
    faThumbsUp,
    faTimes,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

interface Comment {
    redditId: string;
    author: string;
    createdUtc: number;
    score: number;
    content: string;
}

interface Post {
    redditId: string;
    title: string;
    titleZh: string;
    content: string;
    contentZh: string;
    author: string;
    createdUtc: number;
    score: number;
    upvoteRatio: number;
    numComments: number;
    url: string;
    postType: string; // 新增字段，表示帖子的类型
    comments: Comment[];
}

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const {selectedPost, selectPost, clearPost} = usePostStore();
    const initialRender = useRef(true); // 添加这个 ref 来检查是否是初次渲染
    const detailsRef = useRef(null);

    const fetchPosts = async (page: number) => {
        setLoading(true);
        const res = await fetch(`/api/post?page=${page}`);
        const {posts: newPosts, hasMore: newHasMore} = await res.json();
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(newHasMore);
        setLoading(false);
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            fetchPosts(1); // 初次渲染时请求第一页数据
        }
    }, []);

    useEffect(() => {
        if (!initialRender.current && page > 1) {
            fetchPosts(page); // 仅在 page 大于 1 时请求
        }
    }, [page]);

    // 监听 selectedPost 变化，并滚动到顶部
    useEffect(() => {
        if (selectedPost && detailsRef.current) {
            (detailsRef.current as any).scrollTop = 0;
        }
    }, [selectedPost]);

    const lastPostElementRef = useCallback((node: HTMLElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const renderPostContent = (post: Post) => {
        switch (post.postType) {
            case 'self':
                return <p className="m-0 text-xs md:text-sm opacity-80 content">{post.contentZh || post.content}</p>;
            case 'link':
                return <a href={post.url} className="text-xs md:text-sm text-blue-500 underline">{post.url}</a>;
            case 'image':
                return <img src={post.url} alt={post.title} className="max-w-full h-auto"/>;
            case 'video':
                return <video src={post.url} controls className="max-w-full h-auto"/>;
            case 'gallery':
                return post.contentZh && JSON.parse(post.contentZh).map((imgUrl: string, idx: number) => (
                    <img key={idx} src={imgUrl} alt={`Gallery image ${idx + 1}`} className="max-w-full h-auto"/>
                ));
            case 'poll':
                return <div className="text-xs md:text-sm">{post.contentZh || post.content}</div>;
            default:
                return <p className="m-0 text-xs md:text-sm opacity-80 content">未知类型</p>;
        }
    };

    return (
        <>
            <main
                className={`py-12 max-w-6xl mx-auto min-h-screen flex flex-col items-center justify-between relative transition-transform duration-300 ${selectedPost ? 'transform translate-x-[-22%]' : 'transform translate-x-0'}`}>
                <h1 className="text-3xl md:text-6xl title text-center mb-6 text-shadow-lg">流放之路小贴士 poe.tips</h1>
                <div
                    className="z-10 w-full max-w-5xl text-center text-xs mb-6 flex flex-col-3 gap-3 justify-center items-center">
                    By&nbsp;&nbsp;<a className="hover:underline"
                                     href="https://space.bilibili.com/3537125507074883"
                                     target="_blank"
                                     rel="noopener noreferrer">
                    <span className="text-base text-[#dfcf99]">@TuberPOE大佬攻略汇集地
                    <FontAwesomeIcon className="text-xs ml-2" icon={faArrowUpRightFromSquare}/></span>
                </a>
                    粉丝群：
                    <span className="mt-4">
                        <Image src="/image/qr/wx_fans_001.png" alt="微信群二维码" width="64" height="64"/>
                    </span>
                </div>

                <div
                    className="flex flex-col items-center justify-between bg-black opacity-80 rounded-2xl shadow-custom w-full px-4">
                    <div
                        className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left gap-4">
                        {posts.map((post, index) => {
                            if (index === posts.length - 1) {
                                return (
                                    <div ref={lastPostElementRef} key={post.redditId}
                                         className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:opacity-100 cursor-pointer flex flex-col justify-between"
                                         onClick={() => selectPost(post as any)}>
                                        <div>
                                            <h2 className="mb-3 text-xl md:text-2xl font-semibold title title-short">{post.titleZh || post.title}</h2>
                                            {renderPostContent(post)}
                                        </div>
                                        <div>
                                            <div
                                                className="text-xs text-gray-400 mt-2 flex flex-wrap items-center space-x-2">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1"/>
                                                    {post.score}
                                                </div>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faComments} className="mr-1"/>
                                                    {post.numComments}
                                                </div>
                                            </div>
                                            <div
                                                className="text-xs text-gray-400 mt-2 flex flex-wrap items-center space-x-2">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faUser} className="mr-1"/>
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className="mr-1"/>
                                                    {new Date(post.createdUtc).toLocaleDateString(undefined, {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={post.redditId}
                                         className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:opacity-100 cursor-pointer flex flex-col justify-between"
                                         onClick={() => selectPost(post as any)}>
                                        <div>
                                            <h2 className="mb-3 text-xl md:text-2xl font-semibold title title-short">{post.titleZh || post.title}</h2>
                                            {renderPostContent(post)}
                                        </div>
                                        <div>
                                            <div
                                                className="text-xs text-gray-400 mt-2 flex flex-wrap items-center space-x-2">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1"/>
                                                    {post.score}
                                                </div>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faComments} className="mr-1"/>
                                                    {post.numComments}
                                                </div>
                                            </div>
                                            <div
                                                className="text-xs text-gray-400 mt-2 flex flex-wrap items-center space-x-2">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faUser} className="mr-1"/>
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className="mr-1"/>
                                                    {new Date(post.createdUtc).toLocaleDateString(undefined, {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
                <div className="z-10 w-full max-w-5xl items-center lg:flex text-xs mt-6">
                    By&nbsp;&nbsp;<a className="hover:underline"
                                     href="https://space.bilibili.com/3537125507074883"
                                     target="_blank"
                                     rel="noopener noreferrer">
                    <span className="text-base text-[#dfcf99]">@TuberPOE大佬攻略汇集地
                    <FontAwesomeIcon className="text-xs ml-2" icon={faArrowUpRightFromSquare}/></span>
                </a>
                </div>
            </main>

            {selectedPost && (
                <div
                    ref={detailsRef}
                    className="fixed top-0 right-0 w-full md:w-1/3 h-screen bg-black bg-opacity-80 shadow-custom overflow-auto p-6 z-0 transition-transform duration-300 transform translate-x-0"
                >
                    <button onClick={clearPost} className="title text-lg font-semibold mb-4  z-20 relative">
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-3 title z-20 relative">{selectedPost.titleZh || selectedPost.title}</h2>
                    <div
                        className="text-xs text-gray-400 mt-2 flex flex-wrap items-center space-x-2 justify-end z-20 relative">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-1"/>
                            {selectedPost.author}
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-1"/>
                            {new Date(selectedPost.createdUtc).toLocaleString()}
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faThumbsUp} className="mr-1"/>
                            {selectedPost.score}
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faComments} className="mr-1"/>
                            {selectedPost.numComments}
                        </div>
                    </div>
                    <div className="text-sm mb-4 z-20 relative">{renderPostContent(selectedPost as any)}</div>
                    <div className="mt-4 z-20 relative">
                        {selectedPost.comments.map(comment => (
                            <>
                                <div key={comment.redditId}
                                     className="text-xs text-gray-400 mt-2 flex flex-wrap items-center space-x-2">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faUser} className="mr-1"/>
                                        {comment.author}
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faClock} className="mr-1"/>
                                        {new Date(comment.createdUtc).toLocaleDateString(undefined, {
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faThumbsUp} className="mr-1"/>
                                        {comment.score}
                                    </div>
                                </div>
                                <p className="mb-5 border-l-2 border-gray-300 my-2 pl-2">{comment.contentZh || comment.content}</p>
                            </>
                        ))}

                    </div>
                </div>
            )}
        </>
    );
}
