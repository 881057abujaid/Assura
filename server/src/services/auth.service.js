import bcrypt from "bcryptjs";

import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { Role, UserStatus } from "@prisma/client";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../utils/jwt.js";

export const authService = {};

authService.register = async ({ email, password }) => {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new ApiError(409, "Email is already registered.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: Role.CUSTOMER,
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

    return user;
};

authService.login = async ({ email, password }) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    // Check user account is active or not
    if (user.status !== UserStatus.ACTIVE) {
        throw new ApiError(403, "Your account is inactive. Please contact support.");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password.");
    }

    // Update last login at
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            lastLoginAt: new Date(),
        },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

    // Fresh user fetch
    const loggedInUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        omit: {
            password: true,
            refreshToken: true,
        },
    });

    return {
        user: loggedInUser,
        accessToken,
        refreshToken,
    }
};

authService.logout = async (userId) => {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            refreshToken: null,
        },
    });

    return;
};

authService.refreshAccessToken = async (refreshToken) => {
    // Check if refresh token is provided
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is missing.");
    }

    // verify and decode refresh token
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        },
    });

    if (!user) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token is invalid.");
    }

    const token = await generateAccessAndRefreshToken(user);
    const { password, refreshToken: _, ...safeUser } = user;

    return {
        user: safeUser,
        ...token,
    };
};

const generateAccessAndRefreshToken = async (user) => {
    const accessToken = generateAccessToken({
        id: user.id,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        id: user.id
    });

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refreshToken,
        },
    });

    return {
        accessToken,
        refreshToken,
    };
};