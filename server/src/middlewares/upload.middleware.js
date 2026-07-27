import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const allowedMimTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];

const fileFilter = (req, file, cb) => {
    if (!allowedMimTypes.includes(file.mimetype)) {
        return cb(
            new ApiError(400, "Only PDF, JPG and PNG files are allowed.")
        )
    };

    cb(null, true)
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});