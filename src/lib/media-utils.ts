/**
 * Checks if a given URL points to a video file.
 * Common video extensions: .mp4, .webm, .ogg, .mov, .m4v
 */
export function isVideo(url: string | undefined | null): boolean {
    if (!url) return false;
    
    // Check extension
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.quicktime'];
    const lowerUrl = url.toLowerCase().split('?')[0]; // Ignore query params
    
    if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) {
        return true;
    }
    
    // Check for common video hosting identifiers (optional, but good for completeness)
    if (url.includes('stream') || url.includes('video')) {
        // This is a bit risky but often true in Supabase storage paths for videos
        // We'll stick to extension checking for now unless we see specific patterns
    }

    return false;
}
