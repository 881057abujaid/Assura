import ApiError from "../utils/ApiError.js";
import prisma from "../lib/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const requireCompletedProfile = asyncHandler(async (req, res, next) => {
    // Only enforce this rule for CUSTOMER role
    if (req.user?.role !== "CUSTOMER") {
        return next();
    }

    const customer = await prisma.customer.findUnique({
        where: {
            userId: req.user.id
        }
    });

    if (!customer || !customer.profileCompleted) {
        throw new ApiError(403, "Please complete your customer profile before accessing this resource.");
    }

    next();
});
