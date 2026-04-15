"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { PostCard } from "@/components/feed/post-card";
import { MapPin, Calendar, Link as LinkIcon, Edit3, X, Check, Camera, Mail, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { Post } from "@/types/schema";
import { ProfileDialog } from "@/components/ui/profile-dialog";

export default function ProfilePage() {
    const { profile: user, isLoading: isAuthLoading } = useAuth();
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editWebsite, setEditWebsite] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Profile Modal for peeking at others from your own feed
    const [peekUserId, setPeekUserId] = useState<string | null>(null);
    const [isPeekOpen, setIsPeekOpen] = useState(false);

    const handleUserClick = (userId: string) => {
        setPeekUserId(userId);
        setIsPeekOpen(true);
    };

    // Clean up previews on unmount
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        };
    }, [avatarPreview, bannerPreview]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user?.id) return;
            setIsLoadingPosts(true);
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*, user:profiles!user_id(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("[Profile] Posts fetch error:", error.message);
                    return;
                }

                if (!data) return;

                const formatted = data.map((post: any) => ({
                    ...post,
                    user: Array.isArray(post.user) ? post.user[0] : post.user
                }));
                setUserPosts(formatted);

                // Batch fetch reshare originals
                const reshareIds = formatted
                    .filter((p: any) => p.type === 'reshare' && p.reshare_of_id)
                    .map((p: any) => p.reshare_of_id as string);

                if (reshareIds.length > 0) {
                    const { data: originals } = await supabase
                        .from('posts')
                        .select('*, user:profiles!user_id(*)')
                        .in('id', reshareIds);

                    if (originals && originals.length > 0) {
                        const map = new Map(
                            originals.map((o: any) => [o.id, { ...o, user: Array.isArray(o.user) ? o.user[0] : o.user }])
                        );
                        setUserPosts((prev) =>
                            prev.map((p) =>
                                p.type === 'reshare' && p.reshare_of_id && map.has(p.reshare_of_id)
                                    ? { ...p, resharedPost: map.get(p.reshare_of_id) }
                                    : p
                            )
                        );
                    }
                }
            } catch (err: any) {
                console.error("[Profile] Unexpected fetch error:", err.message);
            } finally {
                setIsLoadingPosts(false);
            }
        };


        if (user?.id) {
            fetchUserPosts();
            setEditName(user.name || "");
            setEditUsername(user.username || "");
            setEditBio(user.bio || "");
            setEditWebsite(user.website || "");
            setEditEmail(user.email || "");
        }
    }, [user?.id, user?.name, user?.username, user?.bio, user?.website, user?.email]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        if (type === 'avatar') {
            setAvatarFile(file);
            setAvatarPreview(previewUrl);
        } else {
            setBannerFile(file);
            setBannerPreview(previewUrl);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            let currentAvatar = user.avatar;
            let currentBanner = user.banner_url;

            if (avatarFile) {
                const uploadedUrl = await uploadImage(avatarFile, "avatars");
                if (uploadedUrl) currentAvatar = uploadedUrl;
            }

            if (bannerFile) {
                const uploadedBannerUrl = await uploadImage(bannerFile, "banners");
                if (uploadedBannerUrl) currentBanner = uploadedBannerUrl;
            }

            const { error } = await supabase.from('profiles').update({
                name: editName,
                username: editUsername,
                avatar: currentAvatar,
                banner_url: currentBanner,
                bio: editBio,
                website: editWebsite,
                email: editEmail
            }).eq('id', user.id);

            if (error) {
                // If this fails, it's likely because the migration wasn't run
                if (error.code === '42703') {
                    throw new Error("Database columns missing. Did you run the migration.sql in Supabase?");
                }
                throw error;
            }

            alert("Profile updated successfully!");
            window.location.reload(); 
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            alert("Error: " + (err.message || "Failed to save profile changes."));
        } finally {
            setIsSaving(false);
        }
    };

    if (isAuthLoading) {
        return <div className="p-12 text-center text-foreground/40">Loading profile...</div>;
    }

    if (!user) {
        return <div className="p-12 text-center text-foreground/40">Profile not found. Please log in.</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header / Banner */}
            <div className="relative group/banner">
                <div className="relative h-48 md:h-64 overflow-hidden bg-foreground/5">
                    <img 
                        src={bannerPreview || user.banner_url || "/images/River-768x424.jpg"} 
                        alt="Banner" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {isEditing && (
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 cursor-pointer opacity-0 group-hover/banner:opacity-100 transition-opacity z-10">
                            <Camera size={32} className="text-white mb-2" />
                            <span className="text-white text-sm font-bold">Change Banner</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'banner')} />
                        </label>
                    )}
                </div>
                <div className="absolute -bottom-16 left-6 md:left-8">
                    <div className="relative group/avatar">
                        <div className="rounded-full p-1.5 bg-background shadow-xl">
                            {avatarPreview ? (
                                <div className="size-28 md:size-32 rounded-full overflow-hidden shrink-0 border-4 border-background">
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <Avatar user={user} className="size-28 md:size-32 border-4 border-background" />
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/40 cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity z-10 m-1.5">
                                <Camera size={20} className="text-white mb-1" />
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'avatar')} />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-20 px-6 md:px-8 pb-8 border-b border-foreground/5">
                <div className="flex justify-between items-start">
                    {isEditing ? (
                        <div className="flex flex-col gap-6 w-full max-w-2xl bg-foreground/[0.02] p-6 rounded-3xl border border-foreground/5">
                            <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2"><Edit3 size={18} className="text-rasta-red" /> Edit Profile</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} disabled={isSaving} className="px-5 py-2 hover:bg-foreground/5 text-foreground rounded-full font-bold text-xs transition-colors">Cancel</button>
                                    <button onClick={handleSaveProfile} disabled={isSaving} className="px-6 py-2 bg-foreground text-background rounded-full font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
                                        {isSaving ? "Saving..." : <><Check size={14} /> Save Changes</>}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-foreground/40 uppercase font-black tracking-widest pl-1">Display Name</label>
                                    <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your Name" className="w-full bg-background border border-foreground/10 p-3 rounded-xl text-sm focus:ring-1 focus:ring-rasta-green outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-foreground/40 uppercase font-black tracking-widest pl-1">Username</label>
                                    <input value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder="username" className="w-full bg-background border border-foreground/10 p-3 rounded-xl text-sm focus:ring-1 focus:ring-rasta-red outline-none" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] text-foreground/40 uppercase font-black tracking-widest pl-1">Bio</label>
                                    <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Tell the village about yourself..." className="w-full bg-background border border-foreground/10 p-3 rounded-xl text-sm focus:ring-1 focus:ring-rasta-yellow outline-none min-h-[100px] resize-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-foreground/40 uppercase font-black tracking-widest pl-1">Website</label>
                                    <div className="relative">
                                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                                        <input value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder="https://..." className="w-full bg-background border border-foreground/10 p-3 pl-9 rounded-xl text-sm focus:ring-1 focus:ring-rasta-green outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-foreground/40 uppercase font-black tracking-widest pl-1">Email</label>
                                    <div className="relative">
                                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                                        <input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-background border border-foreground/10 p-3 pl-9 rounded-xl text-sm focus:ring-1 focus:ring-rasta-red outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                                <p className="text-foreground/50 font-medium">@{user.username}</p>
                            </div>
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-full border border-foreground/10 font-bold text-sm hover:bg-foreground hover:text-background transition-all flex items-center gap-2 shadow-sm">
                                <Edit3 size={16} /> Edit Profile
                            </button>
                        </>
                    )}
                </div>

                {!isEditing && (
                    <>
                        <p className="mt-4 max-w-xl text-foreground/80 leading-relaxed text-[15px]">
                            {user.bio || "Reasoning, growing, and living in unity. Welcome to my village reasoning."}
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm font-medium text-foreground/60">
                            <div className="flex items-center gap-1.5"><MapPin size={16} className="text-rasta-red" /> The Village</div>
                            {user.website && (
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-rasta-green hover:underline">
                                    <Globe size={16} /> {user.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            {user.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail size={16} className="text-rasta-yellow" /> {user.email}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5"><Calendar size={16} /> Joined Recently</div>
                        </div>
                    </>
                )}

                <div className="flex gap-6 mt-6">
                    <div className="hover:text-foreground cursor-pointer transition-colors">
                        <span className="font-bold text-lg">0</span> <span className="text-foreground/40 text-sm ml-1 font-medium">Following</span>
                    </div>
                    <div className="hover:text-foreground cursor-pointer transition-colors">
                        <span className="font-bold text-lg">0</span> <span className="text-foreground/40 text-sm ml-1 font-medium">Followers</span>
                    </div>
                </div>
            </div>

            {/* Profile Content Tabs */}
            <div className="flex border-b border-foreground/5">
                <button className="px-6 py-4 font-bold border-b-2 border-rasta-red text-foreground">Posts</button>
                <button className="px-6 py-4 font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">Replies</button>
                <button className="px-6 py-4 font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">Media</button>
                <button className="px-6 py-4 font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">Likes</button>
            </div>

            {/* Posts Feed */}
            <div className="flex flex-col pb-20">
                {isLoadingPosts ? (
                     <div className="p-12 text-center text-foreground/40">Loading posts...</div>
                ) : userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onUserClick={handleUserClick}
                        />
                    ))
                ) : (
                    <div className="p-12 text-center text-foreground/40">No posts yet.</div>
                )}
            </div>

            <ProfileDialog 
                isOpen={isPeekOpen} 
                userId={peekUserId} 
                onClose={() => setIsPeekOpen(false)} 
            />
        </div>
    );
}
