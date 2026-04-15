"use client";

import { useState } from "react";
import { X, Share2, Twitter, Facebook, Link as LinkIcon, Send, MessageSquare } from "lucide-react";
import { shareToStreams, shareToSocial } from "@/lib/share-utils";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        type: 'article_share' | 'podcast_share' | 'product_share' | 'event_share' | 'workshop_share' | 'channel_share' | 'retreat_share';
        title: string;
        image?: string;
        data: any;
    };
}

export function ShareDialog({ isOpen, onClose, item }: ShareDialogProps) {
    const { profile } = useAuth();
    const [view, setView] = useState<'options' | 'streams'>('options');
    const [comment, setComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    if (!isOpen) return null;

    const handleShareToStreams = async () => {
        if (!profile) return;
        setIsPosting(true);
        const { error } = await shareToStreams(profile as any, item.type, item.data, comment);
        setIsPosting(false);
        if (!error) {
            onClose();
            alert("Shared to Streams!");
            setComment("");
            setView('options');
        } else {
            alert("Error sharing: " + (error as any).message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-foreground/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-foreground/5 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        {view === 'streams' ? (
                            <>
                                <button onClick={() => setView('options')} className="p-1 hover:bg-foreground/5 rounded-full transition-colors">
                                    <MessageSquare size={16} />
                                </button>
                                Share to Streams
                            </>
                        ) : (
                            <>
                                <Share2 size={18} className="text-rasta-green" />
                                Share
                            </>
                        )}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {view === 'options' ? (
                        <div className="grid gap-4">
                            {/* Share to Streams */}
                            <button 
                                onClick={() => setView('streams')}
                                className="flex items-center gap-4 p-4 bg-rasta-green/10 border border-rasta-green/20 rounded-2xl hover:bg-rasta-green/20 transition-all group"
                            >
                                <div className="size-12 rounded-xl bg-rasta-green flex items-center justify-center text-white shadow-lg shadow-rasta-green/20 group-hover:scale-110 transition-transform">
                                    <Send size={24} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-foreground">Post to Streams</div>
                                    <div className="text-xs text-foreground/60">Share with the community feed</div>
                                </div>
                            </button>

                            <div className="flex items-center gap-2 my-2">
                                <div className="h-px grow bg-foreground/5"></div>
                                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Social Media</span>
                                <div className="h-px grow bg-foreground/5"></div>
                            </div>

                            {/* Social Buttons */}
                            <div className="flex justify-between gap-3">
                                <button 
                                    onClick={() => shareToSocial('x', { title: item.title })}
                                    className="flex-1 flex flex-col items-center gap-2 p-4 bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-colors group"
                                >
                                    <Twitter size={24} className="group-hover:text-[#1DA1F2] transition-colors" />
                                    <span className="text-xs font-bold">X Post</span>
                                </button>
                                <button 
                                    onClick={() => shareToSocial('facebook', { title: item.title })}
                                    className="flex-1 flex flex-col items-center gap-2 p-4 bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-colors group"
                                >
                                    <Facebook size={24} className="group-hover:text-[#4267B2] transition-colors" />
                                    <span className="text-xs font-bold">Facebook</span>
                                </button>
                                <button 
                                    onClick={() => shareToSocial('copy', { title: item.title })}
                                    className="flex-1 flex flex-col items-center gap-2 p-4 bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-colors group"
                                >
                                    <LinkIcon size={24} className="group-hover:text-rasta-yellow transition-colors" />
                                    <span className="text-xs font-bold">Copy Link</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Mini Composer */}
                            <div className="flex flex-col gap-3">
                                <textarea 
                                    autoFocus
                                    placeholder="Add your thoughts about this..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-foreground/5 border-none rounded-2xl p-4 text-base focus:ring-1 focus:ring-rasta-green min-h-[100px] outline-none"
                                />

                                {/* Preview Card */}
                                <div className="p-3 bg-foreground/5 border border-foreground/10 rounded-2xl flex gap-3 items-center">
                                    <div className="size-12 rounded-lg overflow-hidden bg-foreground/10 shrink-0">
                                        {item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-rasta-yellow/20 text-rasta-yellow font-bold uppercase text-[8px]">
                                                {item.type.includes('_share') ? item.type.split('_')[0] : 'share'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{item.type.replace('_share', '')}</div>
                                        <div className="text-sm font-bold truncate">{item.title}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleShareToStreams}
                                    disabled={isPosting}
                                    className="w-full py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPosting ? "Posting..." : <><Send size={18} /> Post to Streams</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
