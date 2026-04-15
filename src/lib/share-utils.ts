import { supabase } from "./supabase";
import { User, Post } from "@/types/schema";

export async function shareToStreams(
    user: User, 
    type: string, 
    data: any, 
    comment: string = ""
) {
    if (!user) return { error: "User not authenticated" };

    const newPostId = `share_${Date.now()}`;
    
    const newPost = {
        id: newPostId,
        user_id: user.id,
        content: comment || "Check this out!",
        type: type, // podcast_share, article_share, product_share, etc.
        sharedData: data,
        likes: 0,
        replies: 0,
        timestamp: "Just now"
    };

    const { data: insertedData, error } = await supabase
        .from('posts')
        .insert([newPost]);

    return { data: insertedData, error };
}

export function shareToSocial(platform: 'x' | 'facebook' | 'copy', data: { title: string, url?: string }) {
    const url = data.url || window.location.href;
    const text = `Check out this ${data.title} on RIV!`;

    switch (platform) {
        case 'x':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
            break;
    }
}
