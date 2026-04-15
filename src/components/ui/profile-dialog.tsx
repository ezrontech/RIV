"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Calendar, Mail, Globe, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Avatar } from "./avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/schema";

interface ProfileDialogProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileDialog({ userId, isOpen, onClose }: ProfileDialogProps) {
    const { profile: currentUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0 });

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserProfile();
            checkFollowStatus();
            fetchStats();
        } else {
            setUser(null);
            setIsLoading(true);
        }
    }, [isOpen, userId]);

    const fetchUserProfile = async () => {
        if (!userId) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data && !error) {
            setUser(data);
        }
        setIsLoading(false);
    };

    const checkFollowStatus = async () => {
        if (!userId || !currentUser) return;
        const { data, error } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', userId)
            .single();

        setIsFollowing(!!data && !error);
    };

    const fetchStats = async () => {
        if (!userId) return;
        
        // Fetch follower count
        const { count: followersCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', userId);

        // Fetch following count
        const { count: followingCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId);

        setStats({
            followers: followersCount || 0,
            following: followingCount || 0
        });
    };

    const toggleFollow = async () => {
        if (!userId || !currentUser || isActionLoading) return;
        setIsActionLoading(true);

        if (isFollowing) {
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', currentUser.id)
                .eq('following_id', userId);
            
            if (!error) {
                setIsFollowing(false);
                setStats(s => ({ ...s, followers: Math.max(0, s.followers - 1) }));
            }
        } else {
            const { error } = await supabase
                .from('follows')
                .insert({
                    follower_id: currentUser.id,
                    following_id: userId
                });
            
            if (!error) {
                setIsFollowing(true);
                setStats(s => ({ ...s, followers: s.followers + 1 }));
            }
        }
        setIsActionLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-background border border-foreground/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
                
                {isLoading ? (
                    <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-rasta-green" size={32} />
                        <p className="text-sm font-bold text-foreground/40 animate-pulse">Gathering reasoning...</p>
                    </div>
                ) : user ? (
                    <>
                        {/* Close button */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/60 backdrop-blur text-white rounded-full transition-all group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Banner */}
                        <div className="h-40 relative">
                            <img 
                                src={user.banner_url || "/images/River-768x424.jpg"} 
                                alt="Banner" 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Profile Info Area */}
                        <div className="px-6 pb-8 relative">
                            {/* Avatar (Floating) */}
                            <div className="absolute -top-12 left-6">
                                <div className="rounded-full p-1.5 bg-background shadow-xl">
                                    <Avatar user={user} className="size-24 border-4 border-background" />
                                </div>
                            </div>

                            {/* Action Area (Follow Button) */}
                            <div className="flex justify-end pt-4">
                                {currentUser && currentUser.id !== user.id && (
                                    <button 
                                        onClick={toggleFollow}
                                        disabled={isActionLoading}
                                        className={cn(
                                            "px-8 py-2.5 rounded-full font-black text-sm transition-all flex items-center gap-2 shadow-lg",
                                            isFollowing 
                                                ? "bg-foreground/5 hover:bg-rasta-red/10 hover:text-rasta-red border border-foreground/10" 
                                                : "bg-foreground text-background hover:opacity-90 active:scale-95"
                                        )}
                                    >
                                        {isActionLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : isFollowing ? (
                                            <>Following</>
                                        ) : (
                                            <><UserPlus size={16} /> Follow</>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Info */}
                            <div className="mt-4">
                                <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
                                <p className="text-foreground/50 font-bold -mt-1">@{user.username}</p>
                                
                                <p className="mt-4 text-foreground/80 leading-relaxed text-[15px] font-medium">
                                    {user.bio || "Reasoning, growing, and living in unity. Welcome to my village reasoning."}
                                </p>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-[13px] font-bold text-foreground/40">
                                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-rasta-red" /> The Village</div>
                                    {user.website && (
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-rasta-green hover:underline">
                                            <Globe size={14} /> {user.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                    <div className="flex items-center gap-1.5"><Calendar size={14} /> Joined April 2026</div>
                                </div>

                                <div className="flex gap-6 mt-6 border-t border-foreground/5 pt-6">
                                    <div className="group cursor-pointer">
                                        <span className="font-black text-lg">{stats.following}</span> 
                                        <span className="text-foreground/30 text-xs ml-1 font-bold group-hover:text-foreground transition-colors">Following</span>
                                    </div>
                                    <div className="group cursor-pointer">
                                        <span className="font-black text-lg">{stats.followers}</span> 
                                        <span className="text-foreground/30 text-xs ml-1 font-bold group-hover:text-foreground transition-colors">Followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center text-foreground/40">Profile not found</div>
                )}
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
