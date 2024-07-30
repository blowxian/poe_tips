// app/store.ts
import create from 'zustand';

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
    content: string;
    author: string;
    createdUtc: number;
    score: number;
    upvoteRatio: number;
    numComments: number;
    url: string;
    comments: Comment[];
}

interface PostState {
    selectedPost: Post | null;
    selectPost: (post: Post) => void;
    clearPost: () => void;
}

export const usePostStore = create<PostState>((set) => ({
    selectedPost: null,
    selectPost: (post) => set({selectedPost: post}),
    clearPost: () => set({selectedPost: null}),
}));
