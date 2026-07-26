import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const verifyJWT = async (req, res, next) => {
    try {
        // Extract token from the request
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            throw new ApiError(401, "Unathorized request.");
        }

        // Verify the access token
        const decoded = verifyAccessToken(accessToken);

        if (!decoded) {
            throw new ApiError(401, "Invalid or expired access token.")
        }

        // Fetch user
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
            omit: {
                password: true,
                refreshToken: true,
            },
        });

        if (!user) {
            throw new ApiError(401, "Invalid or expired access token.");
        }

        // Attach user to request
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        next(error);
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user is attached to request
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request.");
        }

        // Check if user has one of the authorized roles
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "You are not authorized to perform this action.");
        }
        next();
    };
};