import path from "path";
import crypto from "crypto";

export const generateStoragePath = ({
    folder,
    entityId,
    originalFileName,
}) => {
    const extension = path.extname(originalFileName);

    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    return `${folder}/${entityId}/${fileName}`;
};