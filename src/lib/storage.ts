import { supabase } from "./supabase";

/**
 * Uploads a file to the Supabase 'media' bucket and returns its public URL.
 * 
 * @param file The File object to upload
 * @param folder The folder path (e.g., 'avatars' or 'posts')
 * @returns The public URL as a string, or null if it failed.
 */
export async function uploadImage(file: File, folder: string = "general"): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        // We throw here instead of returning null so the parent can handle the loading state reset correctly
        throw new Error(uploadError.message);
    }

    const { data: publicData } = supabase.storage.from('media').getPublicUrl(filePath);
    return publicData.publicUrl;
}
