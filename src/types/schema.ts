export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    banner_url?: string;
    bio?: string;
    website?: string;
    email?: string;
    role: 'creator' | 'member' | 'visitor' | string;
}

export interface PollOption {
    id: string;
    label: string;
    votes: number;
}

export interface Post {
    id: string;
    user: User;
    content: string;
    type?: 'standard' | 'poll' | 'carousel' | 'media' | 'video_share' | 'article_share' | 'product_share' | 'event_share' | 'reshare' | string;

    // Standard / Media
    image?: string;
    images?: string[];

    // Poll
    pollOptions?: PollOption[];
    pollTotalWrites?: number;

    // Shared content & Reshare
    referenceId?: string;
    sharedData?: any;
    reshare_of_id?: string;
    reshare_count?: number;
    resharedPost?: Post; // populated client-side for the 'reshare' type

    likes: number;
    replies: number;
    timestamp: string;
    created_at?: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    likes: number;
    created_at: string;
    user: User;
    replies?: Comment[];
    isLiked?: boolean;
}

export interface Series {
    id: string;
    title: string;
    host: string;
    description: string;
    thumbnail: string;
    cover: string;
    episodes: string[];
    category: string;
}
