import path from "path";
import crypto from "crypto";

export const generateStoragePath = (folder, entityId, originalFileName) => {
    // Extract file extension
    const extension = path.extname(originalFileName);

    // Generate unique file name
    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    // Return storage path
    return `${folder}/${entityId}/${fileName}`;
}