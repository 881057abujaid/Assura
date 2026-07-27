import { supabase } from "../lib/supabase.js";
import ApiError from "./ApiError.js";
import env from "../config/env.js";

const bucket = env.SUPABASE_STORAGE_BUCKET;

export const uploadFile = async (buffer, storagePath, mimetype) => {
    const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
            contentType: mimetype,
            upsert: false,
        });

    if (error) {
        throw new ApiError(500, "Failed to upload file.");
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);

    return {
        fileUrl: data.publicUrl,
        storagePath,
    };
};

export const deleteFile = async (storagePath) => {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

    if (error) {
        throw new ApiError(500, "Failed to delete file.");
    }
};