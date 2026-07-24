import asyncHandler from "../utils/asyncHandler.js";
import { userService } from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const userController = {};

userController.getCurrentUser = asyncHandler(async (req, res) => {
    const user = await userService.getCurrentUser(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully.",
            user,
        )
    );
});

userController.updateProfile = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const updatedUser = await userService.updateProfile(req.user.id, email);

    return res.status(200).json(
        new ApiResponse(
            200,
            "User profile updated successfully.",
            updatedUser,
        )
    );
});

userController.changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    await userService.changePassword({
        userId: req.user.id,
        oldPassword,
        newPassword,
        confirmPassword,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Password changed successfully.",
            null,
        )
    );
});