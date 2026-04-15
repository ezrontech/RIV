"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/schema";
import { PostCard } from "@/components/feed/post-card";
import { Avatar } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/search-bar";
import { useAuth } from "@/context/AuthContext";
import { uploadImage } from "@/lib/storage";
import { Image as ImageIcon, X, BarChart2, Plus } from "lucide-react";
import { ProfileDialog } from "@/components/ui/profile-dialog";

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState("");
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [postType, setPostType] = useState<string>("standard");
    const [attachmentMeta1, setAttachmentMeta1] = useState("");
    const [attachmentMeta2, setAttachmentMeta2] = useState("");
    const [pollOptions, setPollOptions] = useState([
        { id: "1", label: "" },
        { id: "2", label: "" },
    ]);
    const [isPosting, setIsPosting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { profile: currentUser } = useAuth();

    // Profile Modal
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data: postsData, error } = await supabase
                    .from("posts")
                    .select("*, user:profiles!user_id(*)")
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("[Community] Posts fetch error:", error.message);
                    return;
                }

                if (!postsData) return;

                // Render all posts immediately
                const formatted = postsData.map((post: any) => ({
                    ...post,
                    user: Array.isArray(post.user) ? post.user[0] : post.user,
                }));
                setPosts(formatted);

                // Enrich reshare posts: fetch all original posts in one batch query
                const reshareIds = formatted
                    .filter((p: any) => p.type === "reshare" && p.reshare_of_id)
                    .map((p: any) => p.reshare_of_id as string);

                if (reshareIds.length === 0) return;

                const { data: originals } = await supabase
                    .from("posts")
                    .select("*, user:profiles!user_id(*)")
                    .in("id", reshareIds);

                if (originals && originals.length > 0) {
                    const originalsMap = new Map(
                        originals.map((o: any) => [
                            o.id,
                            { ...o, user: Array.isArray(o.user) ? o.user[0] : o.user },
                        ])
                    );
                    setPosts((prev) =>
                        prev.map((p) =>
                            p.type === "reshare" && p.reshare_of_id && originalsMap.has(p.reshare_of_id)
                                ? { ...p, resharedPost: originalsMap.get(p.reshare_of_id) }
                                : p
                        )
                    );
                }
            } catch (err: any) {
                console.error("[Community] Unexpected fetch error:", err.message);
            }
        };
        fetchInitialData();
    }, []);


    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setIsProfileOpen(true);
    };

    const handlePost = async () => {
        const hasText = !!content.trim();
        const hasMedia = mediaFiles.length > 0;
        const hasAttachment = !!attachmentMeta1 || postType === "poll";

        if ((!hasText && !hasMedia && !hasAttachment) || !currentUser) return;

        setIsPosting(true);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
            if (!session) throw new Error("No active session. Please sign in again.");

            const newPostId = `new_${Date.now()}`;
            let uploadedUrls: string[] = [];

            if (hasMedia) {
                const results = await Promise.all(
                    mediaFiles.map((file) => uploadImage(file, "posts"))
                );
                uploadedUrls = results.filter((url): url is string => url !== null);
            }

            let dynamicSharedData: any = undefined;
            let finalPostType = postType;

            if (postType === "video_share") {
                dynamicSharedData = {
                    title: attachmentMeta1 || "Village History",
                    thumbnail: "/images/video-thumb-1.jpg",
                    channel: { name: attachmentMeta2 || "RIV Media" },
                    views: "New",
                };
            } else if (postType === "article_share") {
                dynamicSharedData = {
                    title: attachmentMeta1 || "The Roots of Reason",
                    excerpt: attachmentMeta2 || "A deep dive into the cultural foundations of our community...",
                };
            } else if (postType === "event_share") {
                dynamicSharedData = {
                    image: "/images/Retreat-Background.webp",
                    date: attachmentMeta2 || "Coming Soon",
                    title: attachmentMeta1 || "Community Gathering",
                    spots: "Open",
                };
            } else if (postType === "poll") {
                const validOptions = pollOptions
                    .filter((o) => o.label.trim())
                    .map((o, i) => ({ id: i.toString(), label: o.label.trim(), votes: 0 }));
                dynamicSharedData = { options: validOptions, totalVotes: 0 };
            }

            if (postType === "standard") {
                if (uploadedUrls.length > 1) {
                    finalPostType = "carousel";
                } else if (uploadedUrls.length === 1) {
                    finalPostType = "media";
                }
            }

            const newPost: Post = {
                id: newPostId,
                user: currentUser,
                content: content || " ",
                type: finalPostType as any,
                image: uploadedUrls.length === 1 ? uploadedUrls[0] : undefined,
                images: uploadedUrls.length > 1 ? uploadedUrls : undefined,
                sharedData: dynamicSharedData,
                pollOptions: postType === "poll" ? dynamicSharedData?.options : undefined,
                pollTotalWrites: postType === "poll" ? dynamicSharedData?.totalVotes : undefined,
                likes: 0,
                replies: 0,
                timestamp: "Just now",
            };

            setPosts([newPost, ...posts]);

            const postContent = content || " ";
            setContent("");
            setMediaFiles([]);
            setAttachmentMeta1("");
            setAttachmentMeta2("");
            setPollOptions([{ id: "1", label: "" }, { id: "2", label: "" }]);
            setPostType("standard");

            const { error } = await supabase.from("posts").insert([
                {
                    id: newPost.id,
                    user_id: currentUser.id,
                    content: postContent,
                    type: newPost.type,
                    image: newPost.image || null,
                    images: newPost.images || null,
                    sharedData: dynamicSharedData,
                    pollOptions: postType === "poll" ? dynamicSharedData?.options : null,
                    pollTotalWrites: postType === "poll" ? 0 : null,
                    likes: 0,
                    replies: 0,
                    timestamp: "Just now",
                },
            ]);

            if (error) {
                console.error("[POST] Insert error:", error);
                alert("Failed to save post: " + error.message);
            }
        } catch (e: any) {
            const msg = e?.message || "";
            if (msg.includes("exp") && msg.includes("claim")) {
                alert("Auth error: Your session is out of sync. Please refresh and try again.");
            } else {
                alert("Error: " + (e?.message || e));
            }
        } finally {
            setIsPosting(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const validFiles: File[] = [];
        for (const file of files) {
            if (file.type.startsWith("video/")) {
                try {
                    const duration = await new Promise<number>((resolve, reject) => {
                        const video = document.createElement("video");
                        video.preload = "metadata";
                        video.onloadedmetadata = () => resolve(video.duration);
                        video.onerror = () => reject("Invalid video");
                        video.src = URL.createObjectURL(file);
                    });
                    if (duration > 60) {
                        alert(`Video "${file.name}" exceeds the 60-second limit.`);
                        continue;
                    }
                } catch (e) {
                    console.error("Video duration check error", e);
                }
            }
            validFiles.push(file);
            if (mediaFiles.length + validFiles.length >= 10) {
                alert("Maximum 10 media files.");
                break;
            }
        }
        setMediaFiles([...mediaFiles, ...validFiles]);
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Search */}
            <SearchBar
                placeholder="Search posts..."
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {/* Composer */}
            <div className="p-4 border-b border-foreground/5 flex gap-4">
                {currentUser && <Avatar user={currentUser} />}
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share something with the village..."
                        disabled={isPosting}
                        className="w-full bg-transparent border-none focus:ring-0 resize-none text-foreground text-base placeholder:text-foreground/40 min-h-[60px] outline-none"
                    />

                    {mediaFiles.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                            {mediaFiles.map((file, idx) => (
                                <div key={idx} className="relative inline-block shrink-0">
                                    {file.type.startsWith("video/") ? (
                                        <video
                                            src={URL.createObjectURL(file)}
                                            className="h-24 w-24 rounded-lg object-cover border border-foreground/10"
                                        />
                                    ) : (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="h-24 w-24 rounded-lg object-cover border border-foreground/10"
                                        />
                                    )}
                                    <button
                                        onClick={() =>
                                            setMediaFiles(mediaFiles.filter((_, i) => i !== idx))
                                        }
                                        className="absolute -top-1 -right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Poll builder */}
                    {postType === "poll" && (
                        <div className="flex flex-col gap-2 mt-2 p-3 bg-foreground/5 rounded-xl border border-foreground/10">
                            <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                                Poll Builder
                            </span>
                            {pollOptions.map((opt, i) => (
                                <div key={opt.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Option ${i + 1}`}
                                        value={opt.label}
                                        onChange={(e) => {
                                            const newOpts = [...pollOptions];
                                            newOpts[i].label = e.target.value;
                                            setPollOptions(newOpts);
                                        }}
                                        className="flex-1 bg-background border border-foreground/10 p-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-rasta-yellow"
                                    />
                                    {pollOptions.length > 2 && (
                                        <button
                                            onClick={() =>
                                                setPollOptions(pollOptions.filter((_, idx) => idx !== i))
                                            }
                                            className="p-2 text-foreground/40 hover:text-rasta-red transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {pollOptions.length < 5 && (
                                <button
                                    onClick={() =>
                                        setPollOptions([
                                            ...pollOptions,
                                            { id: Math.random().toString(), label: "" },
                                        ])
                                    }
                                    className="flex items-center gap-1 text-xs font-bold text-rasta-green mt-1"
                                >
                                    <Plus size={14} /> Add Option
                                </button>
                            )}
                        </div>
                    )}

                    {/* Attachment meta */}
                    {postType !== "standard" && postType !== "poll" && (
                        <div className="flex flex-col gap-2 mt-2 mb-2 p-3 bg-foreground/5 rounded-xl border border-foreground/10">
                            <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                                {postType.replace("_", " ")} Properties
                            </span>
                            <input
                                type="text"
                                placeholder="Title"
                                value={attachmentMeta1}
                                onChange={(e) => setAttachmentMeta1(e.target.value)}
                                className="w-full bg-background border border-foreground/10 p-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-rasta-yellow"
                            />
                            <input
                                type="text"
                                placeholder={
                                    postType === "video_share"
                                        ? "Channel Name"
                                        : postType === "event_share"
                                        ? "Date"
                                        : "Summary"
                                }
                                value={attachmentMeta2}
                                onChange={(e) => setAttachmentMeta2(e.target.value)}
                                className="w-full bg-background border border-foreground/10 p-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-rasta-yellow"
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-foreground/5">
                        <div className="flex items-center gap-1 sm:gap-3 text-foreground/50">
                            <label
                                title="Attach Media"
                                className={`p-2 rounded-full cursor-pointer transition-colors ${
                                    mediaFiles.length > 0
                                        ? "text-rasta-green bg-foreground/5"
                                        : "hover:bg-foreground/5 hover:text-rasta-green"
                                }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    disabled={isPosting || postType !== "standard"}
                                />
                                <div className="flex items-center gap-1.5 px-1">
                                    <ImageIcon size={20} />
                                    {mediaFiles.length > 0 && (
                                        <span className="text-[10px] font-bold">{mediaFiles.length}</span>
                                    )}
                                </div>
                            </label>

                            <button
                                title="Create Poll"
                                onClick={() =>
                                    setPostType(postType === "poll" ? "standard" : "poll")
                                }
                                className={`p-2 rounded-full transition-colors ${
                                    postType === "poll"
                                        ? "text-rasta-yellow bg-foreground/5"
                                        : "hover:bg-foreground/5 hover:text-rasta-yellow"
                                }`}
                            >
                                <BarChart2 size={20} />
                            </button>
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={
                                (!content.trim() && mediaFiles.length === 0) ||
                                !currentUser ||
                                isPosting
                            }
                            className="px-6 py-2 rounded-full bg-foreground text-background font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            {isPosting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="flex flex-col pb-20">
                {filteredPosts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onDelete={(id) => setPosts(posts.filter((p) => p.id !== id))}
                        onUserClick={handleUserClick}
                    />
                ))}
            </div>

            <ProfileDialog
                isOpen={isProfileOpen}
                userId={selectedUserId}
                onClose={() => setIsProfileOpen(false)}
            />
        </div>
    );
}
