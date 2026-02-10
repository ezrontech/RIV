"use client";

import { MOCK_USERS, MOCK_POSTS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { PostCard } from "@/components/feed/post-card";
import { MapPin, Calendar, Link as LinkIcon, Edit3 } from "lucide-react";

export default function ProfilePage() {
    // Simulating "Sister Irie" as logged in user for this view
    const user = MOCK_USERS[1];
    const userPosts = MOCK_POSTS.filter(p => p.user.id === user.id);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header / Banner */}
            <div className="relative h-48 bg-gradient-to-r from-rasta-green/20 via-rasta-yellow/20 to-rasta-red/20">
                <div className="absolute -bottom-12 left-6">
                    <div className="rounded-full p-1 bg-background">
                        <div className="size-24 rounded-full overflow-hidden border-4 border-background">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-14 px-6 pb-6 border-b border-foreground/5">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-foreground/60">@{user.username}</p>
                    </div>
                    <button className="px-4 py-2 rounded-full border border-foreground/20 font-bold text-sm hover:bg-foreground/5 transition-colors flex items-center gap-2">
                        <Edit3 size={16} /> Edit Profile
                    </button>
                </div>

                <p className="mt-4 max-w-lg text-foreground/80">
                    Passionate about Ital cooking and preserving our traditions.
                    Teaching the next generation about the healing power of herbs.
                </p>

                <div className="flex gap-4 mt-4 text-sm text-foreground/50">
                    <div className="flex items-center gap-1"><MapPin size={14} /> Montego Bay, Jamaica</div>
                    <div className="flex items-center gap-1"><LinkIcon size={14} /> irievibes.com</div>
                    <div className="flex items-center gap-1"><Calendar size={14} /> Joined March 2024</div>
                </div>

                <div className="flex gap-6 mt-6 font-bold text-sm">
                    <div className="hover:underline cursor-pointer"><span>142</span> <span className="text-foreground/50 font-normal">Following</span></div>
                    <div className="hover:underline cursor-pointer"><span>895</span> <span className="text-foreground/50 font-normal">Followers</span></div>
                </div>
            </div>

            {/* Profile Content Tabs */}
            <div className="flex border-b border-foreground/5">
                <button className="px-6 py-4 font-bold border-b-2 border-rasta-red text-foreground">Reasonings</button>
                <button className="px-6 py-4 font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">Replies</button>
                <button className="px-6 py-4 font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">Media</button>
                <button className="px-6 py-4 font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">Likes</button>
            </div>

            {/* Posts Feed */}
            <div className="flex flex-col pb-20">
                {userPosts.length > 0 ? (
                    userPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="p-12 text-center text-foreground/40">No posts yet.</div>
                )}
            </div>
        </div>
    );
}
