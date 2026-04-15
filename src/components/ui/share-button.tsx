"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { ShareDialog } from "./share-dialog";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    item: {
        type: 'article_share' | 'podcast_share' | 'product_share' | 'event_share' | 'workshop_share' | 'channel_share' | 'retreat_share';
        title: string;
        image?: string;
        data: any;
    };
    className?: string;
    showLabel?: boolean;
}

export function ShareButton({ item, className, showLabel = false }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Cast channel_share to video_share for the dialog/schema if needed
    const dialogItem = {
        ...item,
        type: item.type === 'channel_share' ? 'video_share' as any : item.type
    };

    return (
        <>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className={cn(
                    "flex items-center gap-1.5 hover:text-foreground transition-colors group",
                    className
                )}
                title="Share"
            >
                <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                {showLabel && <span className="text-sm font-medium">Share</span>}
            </button>

            <ShareDialog 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                item={dialogItem} 
            />
        </>
    );
}
