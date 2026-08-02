import { authService } from "../services/auth.service.js";
import { cookieOptions } from "../constants/cookie.js";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authController = {};

authController.register = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;

    const user = await authService.register({
        email,
        password,
        fullName
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully.",
            user
        )
    );
});

authController.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login({
        email,
        password,
    });

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                "User logged in successfully",
                {
                    user,
                }
            )
        );
});

authController.logout = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await authService.logout(userId);

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                "User logged out successfully.",
                null,
            )
        );
});

authController.refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                "Access token refreshed successfully.",
                {
                    user,
                },
            )
        );
});