import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { Role } from "@prisma/client";

export const userService = {};

userService.getCurrentUser = async (userId) => {
    // Find user in DB
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            customer: true,
        },
        omit: {
            password: true,
            refreshToken: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    return user;
};

userService.updateProfile = async (userId, email) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Check if user is trying to update with same email
    if (user.email === email) {
        throw new ApiError(409, "Please provide a different email.");
    }

    // Check if the provided email is already taken by another user
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new ApiError(409, "Email already taken.");
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            email,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            lastLoginAt: true,
            createdAt: true
        }
    });

    return updatedUser;
};

userService.changePassword = async ({ userId, oldPassword, newPassword, confirmPassword }) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match");
    }

    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old password");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    return;
}

userService.getUnassignedUsers = async () => {
    return await prisma.user.findMany({
        where: {
            role: "CUSTOMER",
            customer: null
        },
        select: {
            id: true,
            email: true
        }
    });
};

userService.getAgents = async () => {
    return await prisma.user.findMany({
        where: {
            role: Role.AGENT
        },
        select: {
            id: true,
            email: true,
            role: true
        }
    });
};