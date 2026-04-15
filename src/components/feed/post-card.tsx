"use client";

import { Post } from "@/types/schema";
import { Avatar } from "@/components/ui/avatar";
import {
    Heart, MessageCircle, Repeat2,
    ChevronLeft, ChevronRight, Edit2, Check, X, Trash2, Send, Loader2, CornerDownRight,
    Repeat, Play, Volume2, VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ShareButton } from "@/components/ui/share-button";
import { isVideo } from "@/lib/media-utils";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    likes: number;
    created_at: string;
    user: { id: string; username: string; name: string; avatar: string };
    replies?: Comment[];
    isLiked?: boolean;
}

interface PostCardProps {
    post: Post;
    onDelete?: (id: string) => void;
    onUserClick?: (userId: string) => void;
}

// ─── VideoPlayer ─────────────────────────────────────────────────────────────
function VideoPlayer({ src, className }: { src: string; className?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            if (!isMuted) {
                videoRef.current.volume = 1.0;
            }
        }
    }, [isMuted]);

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(err => {
                console.error("Video playback failed:", err);
            });
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    return (
        <div className={cn("relative group/video overflow-hidden", className)}>
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                playsInline
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                muted={isMuted}
            />
            
            {/* Interaction Layer - Captures all clicks reliably */}
            <div 
                className="absolute inset-0 z-20 cursor-pointer" 
                onClick={togglePlay} 
            />
            
            {/* Volume Toggle */}
            <button 
                onClick={toggleMute}
                className="absolute bottom-3 right-3 z-40 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all opacity-0 group-hover/video:opacity-100"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Centered Play Button Overlay */}
            <div className={cn(
                "absolute inset-0 z-30 flex items-center justify-center transition-all duration-300 pointer-events-none",
                isPlaying ? "opacity-0 scale-150" : "opacity-100 scale-100"
            )}>
                <div className="size-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                    <Play size={32} className="text-white fill-white ml-1" />
                </div>
            </div>

            {/* Subtle Gradient for readability */}
            {!isPlaying && (
                <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />
            )}
        </div>
    );
}

// ─── ResharedPostEmbed ────────────────────────────────────────────────────────
// Mini inline card that shows the original post inside a reshare
function ResharedPostEmbed({ post, onUserClick }: { post: Post; onUserClick?: (id: string) => void }) {
    return (
        <div className="mt-3 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 space-y-3">
            <div className="flex items-center gap-2">
                <div
                    className="size-8 rounded-full overflow-hidden bg-foreground/10 cursor-pointer shrink-0 border border-foreground/10"
                    onClick={() => onUserClick && post.user?.id && onUserClick(post.user.id)}
                >
                    <img src={post.user?.avatar || "/riv-logo.webp"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col">
                    <span
                        className="text-sm font-bold cursor-pointer hover:underline"
                        onClick={() => onUserClick && post.user?.id && onUserClick(post.user.id)}
                    >
                        {post.user?.username}
                    </span>
                    <span className="text-[10px] text-foreground/40">{post.timestamp}</span>
                </div>
            </div>
            {post.content && post.content.trim() && (
                <p className="text-[14px] text-foreground/90 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            )}
            {post.image && (
                <div className="rounded-xl overflow-hidden border border-foreground/5 bg-foreground/5">
                    {isVideo(post.image) ? (
                        <VideoPlayer src={post.image} className="w-full h-full max-h-[400px] aspect-video" />
                    ) : (
                        <img src={post.image} alt="reshared media" className="w-full h-auto max-h-[400px] object-cover" />
                    )}
                </div>
            )}
            {post.images && post.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {post.images.map((img, i) => (
                        <div key={i} className="relative aspect-[3/4] w-[45%] shrink-0 rounded-xl overflow-hidden bg-foreground/5 border border-foreground/10 shadow-sm">
                            {isVideo(img) ? (
                                <VideoPlayer src={img} className="w-full h-full" />
                            ) : (
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur text-[8px] font-bold text-white">
                                {i + 1}/{post.images?.length ?? 0}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main PostCard ────────────────────────────────────────────────────────────
export function PostCard({ post, onDelete, onUserClick }: PostCardProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const { profile: currentUser } = useAuth();

    // Edit
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [isSaving, setIsSaving] = useState(false);
    const [currentContent, setCurrentContent] = useState(post.content);

    // Like — loaded from DB on mount
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes ?? 0);
    const [isLiking, setIsLiking] = useState(false);
    const [likeInitialized, setLikeInitialized] = useState(false);

    // Reshare
    const [reshared, setReshared] = useState(false);
    const [reshareCount, setReshareCount] = useState(post.reshare_count ?? 0);
    const [isResharing, setIsResharing] = useState(false);
    const [showReshareMenu, setShowReshareMenu] = useState(false);

    // Comments
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [replyCount, setReplyCount] = useState(post.replies ?? 0);
    const [commentText, setCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    // Reply-to
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isPostingReply, setIsPostingReply] = useState(false);

    const isAuthor = currentUser?.id === post.user?.id;
    const isResharePost = post.type === "reshare";

    // ── Init: load liked state from DB ────────────────────────────────────────
    useEffect(() => {
        if (!currentUser?.id || likeInitialized) return;
        const checkLike = async () => {
            const { data } = await supabase
                .from("post_likes")
                .select("post_id")
                .eq("post_id", post.id)
                .eq("user_id", currentUser.id)
                .maybeSingle();
            setLiked(!!data);
            setLikeInitialized(true);
        };
        checkLike();
    }, [currentUser?.id, post.id]);

    // ── Init: check if current user already reshared this post ───────────────
    useEffect(() => {
        if (!currentUser?.id) return;
        const checkReshare = async () => {
            const { data } = await supabase
                .from("posts")
                .select("id")
                .eq("user_id", currentUser.id)
                .eq("type", "reshare")
                .eq("reshare_of_id", post.id)
                .maybeSingle();
            setReshared(!!data);
        };
        checkReshare();
    }, [currentUser?.id, post.id]);

    // ── Load comments ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (showComments && !commentsLoaded) loadComments();
    }, [showComments]);

    const loadComments = async () => {
        if (isLoadingComments) return;
        setIsLoadingComments(true);
        try {
            const { data, error } = await supabase
                .from("comments")
                .select("*, user:profiles!user_id(id, username, name, avatar)")
                .eq("post_id", post.id)
                .order("created_at", { ascending: true });

            if (error) throw error;

            const raw = (data || []).map((c: any) => ({
                ...c,
                user: Array.isArray(c.user) ? c.user[0] : c.user,
                replies: [],
                isLiked: false
            }));

            // Fetch current user likes for these comments
            if (currentUser && raw.length > 0) {
                const { data: userLikes } = await supabase
                    .from("comment_likes")
                    .select("comment_id")
                    .eq("user_id", currentUser.id)
                    .in("comment_id", raw.map(c => c.id));
                
                if (userLikes) {
                    const likedIds = new Set(userLikes.map(ul => ul.comment_id));
                    raw.forEach(c => {
                        c.isLiked = likedIds.has(c.id);
                    });
                }
            }

            // Threading
            const commentMap = new Map();
            const topLevel: Comment[] = [];

            raw.forEach(c => commentMap.set(c.id, { ...c }));
            raw.forEach(c => {
                if (c.parent_id && commentMap.has(c.parent_id)) {
                    commentMap.get(c.parent_id).replies.push(commentMap.get(c.id));
                } else if (!c.parent_id) {
                    topLevel.push(commentMap.get(c.id));
                }
            });

            setComments(topLevel);
        } catch (err: any) {
            console.error("Error loading comments:", err);
        } finally {
            setIsLoadingComments(false);
            setCommentsLoaded(true); // Prevents infinite re-trigger loop on error
        }
    };

    // ── Post comment ──────────────────────────────────────────────────────────
    const handlePostComment = async () => {
        if (!commentText.trim() || !currentUser || isPosting) return;
        setIsPosting(true);
        try {
            const { data, error } = await supabase
                .from("comments")
                .insert({ post_id: post.id, user_id: currentUser.id, parent_id: null, content: commentText.trim() })
                .select("*, user:profiles!user_id(id, username, name, avatar)")
                .single();
            if (error) throw error;
            const newComment: Comment = { ...data, user: Array.isArray(data.user) ? data.user[0] : data.user, replies: [] };
            setComments((prev) => [...prev, newComment]);
            setReplyCount((c) => c + 1);
            setCommentText("");
        } catch (err: any) {
            alert("Could not post comment: " + err.message);
        } finally {
            setIsPosting(false);
        }
    };

    // ── Post reply ────────────────────────────────────────────────────────────
    const handlePostReply = async (parentComment: Comment) => {
        if (!replyText.trim() || !currentUser || isPostingReply) return;
        setIsPostingReply(true);
        try {
            const { data, error } = await supabase
                .from("comments")
                .insert({ post_id: post.id, user_id: currentUser.id, parent_id: parentComment.id, content: replyText.trim() })
                .select("*, user:profiles!user_id(id, username, name, avatar)")
                .single();
            if (error) throw error;
            const newReply: Comment = { ...data, user: Array.isArray(data.user) ? data.user[0] : data.user };
            setComments((prev) =>
                prev.map((c) => c.id === parentComment.id ? { ...c, replies: [...(c.replies || []), newReply] } : c)
            );
            setReplyText("");
            setReplyingTo(null);
        } catch (err: any) {
            alert("Could not post reply: " + err.message);
        } finally {
            setIsPostingReply(false);
        }
    };

    // ── Delete comment ────────────────────────────────────────────────────────
    const handleDeleteComment = async (commentId: string, parentId: string | null) => {
        await supabase.from("comments").delete().eq("id", commentId);
        if (!parentId) {
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            setReplyCount((n) => Math.max(0, n - 1));
        } else {
            setComments((prev) =>
                prev.map((c) =>
                    c.id === parentId ? { ...c, replies: (c.replies || []).filter((r) => r.id !== commentId) } : c
                )
            );
        }
    };

    // ── Like (DB-backed via post_likes table) ─────────────────────────────────
    const handleLike = async () => {
        if (isLiking || !currentUser) return;
        setIsLiking(true);
        const nowLiked = !liked;
        setLiked(nowLiked);
        setLikeCount((c) => Math.max(0, c + (nowLiked ? 1 : -1)));
        try {
            if (nowLiked) {
                await supabase.from("post_likes").insert({ post_id: post.id, user_id: currentUser.id });
            } else {
                await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", currentUser.id);
            }
        } catch {
            // Rollback
            setLiked(!nowLiked);
            setLikeCount((c) => Math.max(0, c + (nowLiked ? -1 : 1)));
        } finally {
            setIsLiking(false);
        }
    };

    // ── Reshare (creates a new post in DB) ────────────────────────────────────
    const handleReshare = async () => {
        if (!currentUser || isResharing || reshared) return;
        setIsResharing(true);
        try {
            const { error } = await supabase.from("posts").insert([{
                id: crypto.randomUUID(),
                user_id: currentUser.id,
                content: "",          // optional caption – empty for now
                type: "reshare",
                reshare_of_id: post.id,
                likes: 0,
                replies: 0,
                timestamp: "Just now",
            }]);
            
            if (error) {
                console.error("Supabase insert error:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }
            
            setReshared(true);
            setReshareCount((c) => c + 1);
        } catch (err: any) {
            console.error("Reshare failed:", err);
            alert("Could not reshare: " + (err.message || "Unknown error"));
        } finally {
            setIsResharing(false);
            setShowReshareMenu(false);
        }
    };

    // ── Undo reshare ──────────────────────────────────────────────────────────
    const handleUndoReshare = async () => {
        if (!currentUser) return;
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("user_id", currentUser.id)
            .eq("type", "reshare")
            .eq("reshare_of_id", post.id);
        if (!error) {
            setReshared(false);
            setReshareCount((c) => Math.max(0, c - 1));
        }
        setShowReshareMenu(false);
    };

    // ── Edit/Delete ───────────────────────────────────────────────────────────
    const handleSaveEdit = async () => {
        if (!editedContent.trim() || editedContent === currentContent) { setIsEditing(false); return; }
        setIsSaving(true);
        try {
            const { error } = await supabase.from("posts").update({ content: editedContent }).eq("id", post.id);
            if (error) throw error;
            setCurrentContent(editedContent);
            setIsEditing(false);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        setIsSaving(true);
        try {
            const { error } = await supabase.from("posts").delete().eq("id", post.id);
            if (error) throw error;
            if (onDelete) onDelete(post.id);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // ── Media content renderer ────────────────────────────────────────────────
    const renderContent = () => {
        if (isResharePost) {
            // The resharedPost is either embedded in sharedData or passed directly
            const original: Post | null = post.resharedPost || post.sharedData || null;
            return original ? <ResharedPostEmbed post={original} onUserClick={onUserClick} /> : null;
        }

        switch (post.type) {
            case "media":
                return post.image && (
                    <div className="relative rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/5 mt-2 transition-all">
                        {isVideo(post.image) ? (
                            <VideoPlayer src={post.image} className="w-full max-h-[440px] aspect-video" />
                        ) : (
                            <img src={post.image} alt="Post media" className="w-full h-auto max-h-[440px] object-cover" />
                        )}
                    </div>
                );

            case "carousel":
                return post.images && (
                    <div className="relative mt-2 group/carousel">
                        <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white border border-white/10 pointer-events-none tabular-nums">
                            {post.images.length} photos
                        </div>
                        <div ref={carouselRef} className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 px-0.5">
                            {post.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-[3/4] w-[62%] sm:w-[56%] shrink-0 snap-start rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10 shadow-md group/img">
                                    {isVideo(img) ? (
                                        <VideoPlayer src={img} className="w-full h-full" />
                                    ) : (
                                        <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur text-[9px] font-bold text-white">
                                        {idx + 1}/{post.images?.length ?? 0}
                                    </div>
                                </div>
                            ))}
                            <div className="w-[8%] shrink-0" />
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
                            <button onClick={() => carouselRef.current?.scrollBy({ left: -(carouselRef.current.clientWidth * 0.65), behavior: "smooth" })} className="p-2 bg-black/50 backdrop-blur-xl text-white rounded-full hover:bg-black/70 border border-white/20 shadow-xl">
                                <ChevronLeft size={16} />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
                            <button onClick={() => carouselRef.current?.scrollBy({ left: carouselRef.current.clientWidth * 0.65, behavior: "smooth" })} className="p-2 bg-black/50 backdrop-blur-xl text-white rounded-full hover:bg-black/70 border border-white/20 shadow-xl">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="flex justify-center gap-1 mt-1">
                            {(post.images ?? []).map((_, idx) => (
                                <div key={idx} className={cn("h-1 rounded-full transition-all duration-300", idx === 0 ? "w-4 bg-rasta-yellow" : "w-1.5 bg-foreground/20")} />
                            ))}
                        </div>
                    </div>
                );

            case "poll":
                return post.pollOptions && (
                    <div className="mt-2 space-y-2 p-3 bg-foreground/5 rounded-2xl border border-foreground/5">
                        {post.pollOptions.map((opt: any) => (
                            <button key={opt.id} className="w-full relative group/opt overflow-hidden rounded-xl">
                                <div className="absolute inset-0 bg-foreground/5 group-hover/opt:bg-foreground/10 transition-colors rounded-xl" />
                                <div className="relative p-3 flex justify-between items-center text-sm font-bold">
                                    <span>{opt.label}</span>
                                    <span className="text-foreground/40">{opt.votes || 0}%</span>
                                </div>
                            </button>
                        ))}
                        <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest pl-1">{post.pollTotalWrites || 0} votes</p>
                    </div>
                );

            default:
                return null;
        }
    };

    // ── Comment bubble ────────────────────────────────────────────────────────
    const CommentBubble = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
        const isOwn = currentUser?.id === comment.user_id;
        const isReplying = replyingTo?.id === comment.id;
        const [cliked, setCliked] = useState(comment.isLiked || false);
        const [clikeCount, setClikeCount] = useState(comment.likes || 0);

        const handleToggleLike = async () => {
            if (!currentUser) return;
            const newLiked = !cliked;
            setCliked(newLiked);
            setClikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));

            try {
                if (newLiked) {
                    await supabase.from("comment_likes").insert({ comment_id: comment.id, user_id: currentUser.id });
                } else {
                    await supabase.from("comment_likes").delete().eq("comment_id", comment.id).eq("user_id", currentUser.id);
                }
            } catch (err) {
                // Rollback
                setCliked(!newLiked);
                setClikeCount(prev => !newLiked ? prev + 1 : Math.max(0, prev - 1));
            }
        };

        return (
            <div className={cn("flex gap-2", isReply && "ml-8 mt-1.5")}>
                {isReply && <CornerDownRight size={12} className="shrink-0 mt-2 text-foreground/20" />}
                <div onClick={() => onUserClick && comment.user?.id && onUserClick(comment.user.id)} className="shrink-0 cursor-pointer">
                    <div className={cn("rounded-full overflow-hidden bg-foreground/10 border border-foreground/10", isReply ? "size-6" : "size-7")}>
                        <img src={comment.user?.avatar || "/riv-logo.webp"} alt={comment.user?.username} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="bg-foreground/5 rounded-2xl px-3 py-2 inline-block max-w-full relative group/comm">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-bold">{comment.user?.username}</span>
                            <span className="text-[9px] text-foreground/30">
                                {new Date(comment.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                        <p className="text-[13px] text-foreground/90 leading-relaxed break-words">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1">
                        <button 
                            onClick={handleToggleLike}
                            className={cn("flex items-center gap-1 text-[11px] font-bold transition-colors", cliked ? "text-rasta-red" : "text-foreground/40 hover:text-rasta-red")}
                        >
                            <Heart size={11} className={cn(cliked && "fill-rasta-red")} />
                            {clikeCount > 0 && <span>{clikeCount}</span>}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => { setReplyingTo(isReplying ? null : comment); setReplyText(""); }}
                                className={cn("text-[11px] font-bold transition-colors", isReplying ? "text-rasta-yellow" : "text-foreground/40 hover:text-rasta-yellow")}
                            >Reply</button>
                        )}
                        {isOwn && (
                            <button onClick={() => handleDeleteComment(comment.id, comment.parent_id)} className="text-[11px] font-bold text-foreground/30 hover:text-rasta-red transition-colors">Delete</button>
                        )}
                    </div>
                    {isReplying && (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 bg-foreground/5 rounded-2xl px-3 py-1.5 border border-rasta-yellow/30">
                                <input
                                    autoFocus
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handlePostReply(comment)}
                                    placeholder={`Reply to @${comment.user?.username}...`}
                                    className="flex-1 bg-transparent outline-none text-[13px] text-foreground placeholder:text-foreground/40"
                                />
                                <button onClick={() => handlePostReply(comment)} disabled={!replyText.trim() || isPostingReply} className="text-rasta-yellow disabled:opacity-30 hover:scale-110 transition-all">
                                    {isPostingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
            {/* Reshare attribution header */}
            {isResharePost && (
                <div className="flex items-center gap-2 px-4 pt-2.5 pb-0 text-foreground/40">
                    <Repeat size={13} />
                    <span className="text-[11px] font-bold">
                        <span
                            className="cursor-pointer hover:text-foreground"
                            onClick={() => onUserClick && post.user?.id && onUserClick(post.user.id)}
                        >
                            @{post.user?.username}
                        </span>
                        {" "}reshared
                    </span>
                </div>
            )}

            <div className="flex gap-3 px-4 py-3">
                {/* Avatar + thread line */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div onClick={() => onUserClick && post.user?.id && onUserClick(post.user.id)} className="cursor-pointer hover:scale-110 transition-transform">
                        <Avatar user={post.user} />
                    </div>
                    <div className="w-0.5 grow bg-foreground/10 my-1 rounded-full" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5 pb-3">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span onClick={() => onUserClick && post.user?.id && onUserClick(post.user.id)} className="font-bold text-sm cursor-pointer hover:underline">
                                {post.user?.username}
                            </span>
                            {post.user?.role === "creator" && (
                                <span className="px-1.5 py-0.5 rounded-full bg-rasta-yellow/20 text-rasta-yellow text-[9px] font-bold uppercase tracking-wide border border-rasta-yellow/30">Creator</span>
                            )}
                            <span className="text-foreground/40 text-xs">{post.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {isAuthor && !isEditing && (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="p-1 text-foreground/40 hover:text-rasta-green transition-colors" title="Edit"><Edit2 size={13} /></button>
                                    <button onClick={handleDelete} disabled={isSaving} className="p-1 text-foreground/40 hover:text-rasta-red transition-colors" title="Delete"><Trash2 size={13} /></button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Text */}
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea disabled={isSaving} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full bg-foreground/5 border-none rounded-xl p-3 text-[14px] focus:ring-1 focus:ring-rasta-green outline-none resize-y min-h-[72px]" />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setIsEditing(false); setEditedContent(currentContent); }} disabled={isSaving} className="p-1.5 bg-foreground/10 rounded-full hover:bg-foreground/20"><X size={13} /></button>
                                <button onClick={handleSaveEdit} disabled={isSaving} className="p-1.5 bg-rasta-green text-white rounded-full hover:opacity-80 shadow-lg"><Check size={13} /></button>
                            </div>
                        </div>
                    ) : (
                        currentContent && currentContent.trim() && (
                            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-[14px]">{currentContent}</p>
                        )
                    )}

                    {/* Media / poll / reshared embed */}
                    {renderContent()}

                    {/* Action bar */}
                    <div className="flex items-center gap-5 pt-1 text-foreground/50">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            disabled={isLiking || !currentUser}
                            className={cn("flex items-center gap-1.5 transition-colors group", liked ? "text-rasta-red" : "hover:text-rasta-red")}
                        >
                            <Heart size={17} className={cn("transition-all duration-200 group-hover:scale-110", liked && "fill-rasta-red")} />
                            <span className="text-xs font-semibold tabular-nums">{likeCount > 0 ? likeCount : ""}</span>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={() => setShowComments((v) => !v)}
                            className={cn("flex items-center gap-1.5 transition-colors group", showComments ? "text-rasta-yellow" : "hover:text-rasta-yellow")}
                        >
                            <MessageCircle size={17} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold tabular-nums">{replyCount > 0 ? replyCount : ""}</span>
                        </button>

                        {/* Reshare */}
                        <div className="relative">
                            <button
                                onClick={() => currentUser && setShowReshareMenu((v) => !v)}
                                className={cn("flex items-center gap-1.5 transition-colors group", reshared ? "text-rasta-green" : "hover:text-rasta-green")}
                            >
                                <Repeat2 size={17} className={cn("group-hover:scale-110 transition-all", reshared && "scale-110")} />
                                <span className="text-xs font-semibold tabular-nums">{reshareCount > 0 ? reshareCount : ""}</span>
                            </button>

                            {showReshareMenu && (
                                <div className="absolute bottom-8 left-0 z-50 bg-background border border-foreground/10 rounded-2xl shadow-2xl py-1 min-w-[160px] animate-in zoom-in-95 duration-150">
                                    {reshared ? (
                                        <button onClick={handleUndoReshare} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rasta-red hover:bg-rasta-red/10 transition-colors">
                                            <Repeat2 size={15} /> Undo Reshare
                                        </button>
                                    ) : (
                                        <button onClick={handleReshare} disabled={isResharing} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-foreground/5 transition-colors">
                                            {isResharing ? <Loader2 size={15} className="animate-spin" /> : <Repeat2 size={15} />}
                                            Reshare
                                        </button>
                                    )}
                                    <button onClick={() => setShowReshareMenu(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/50 hover:bg-foreground/5 transition-colors">
                                        <X size={15} /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* External share */}
                        <ShareButton
                            item={{
                                type: "article_share",
                                title: `Post by ${post.user?.username}`,
                                image: post.image || (post.images ? post.images[0] : undefined),
                                data: { ...post, title: (post.content || "").substring(0, 50) + "..." },
                            }}
                            className="ml-auto flex items-center gap-1.5 hover:text-foreground transition-colors group"
                        />
                    </div>

                    {/* Comment thread */}
                    {showComments && (
                        <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                            {isLoadingComments ? (
                                <div className="flex items-center gap-2 text-foreground/40 text-xs py-2 pl-1">
                                    <Loader2 size={14} className="animate-spin" /> Loading comments...
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="space-y-1.5">
                                        <CommentBubble comment={comment} />
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="space-y-1.5">
                                                {comment.replies.map((reply) => <CommentBubble key={reply.id} comment={reply} isReply />)}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {currentUser && (
                                <div className="flex items-center gap-2 pt-1">
                                    <div className="size-7 rounded-full overflow-hidden shrink-0 bg-foreground/10">
                                        <img src={currentUser.avatar || "/riv-logo.webp"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 bg-foreground/5 rounded-2xl px-3 py-2 border border-foreground/10 focus-within:border-rasta-yellow/50 transition-colors">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handlePostComment()}
                                            placeholder="Add a comment..."
                                            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/40"
                                        />
                                        <button onClick={handlePostComment} disabled={!commentText.trim() || isPosting} className="text-rasta-green disabled:opacity-30 hover:scale-110 transition-all">
                                            {isPosting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
