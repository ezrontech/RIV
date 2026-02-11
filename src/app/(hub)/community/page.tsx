"use client";

import { MOCK_POSTS, MOCK_USERS, Post } from "@/lib/mock-data";
import { PostCard } from "@/components/feed/post-card";
import { Avatar } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/search-bar";
import { useState } from "react";

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [content, setContent] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Use the first user as the "current user"
    const currentUser = MOCK_USERS[1];

    const handlePost = () => {
        if (!content.trim()) return;

        const newPost: Post = {
            id: `new_${Date.now()}`,
            user: currentUser,
            content: content,
            likes: 0,
            replies: 0,
            timestamp: "Just now"
        };

        setPosts([newPost, ...posts]);
        setContent("");
    };

    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Feed Header */}
            <SearchBar
                placeholder="Search reasoning..."
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {/* New Post Composer */}
            <div className="p-4 border-b border-foreground/5 flex gap-4">
                <Avatar user={currentUser} />
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start a reasoning..."
                        className="w-full bg-transparent border-none focus:ring-0 resize-none text-foreground text-base placeholder:text-foreground/40 min-h-[80px] outline-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-foreground/40 font-medium">Anyone can reply</div>
                        <button
                            onClick={handlePost}
                            disabled={!content.trim()}
                            className="px-4 py-1.5 rounded-full bg-foreground text-background font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="flex flex-col pb-20">
                {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
