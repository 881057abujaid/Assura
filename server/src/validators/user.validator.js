import { z } from "zod";

export const updateProfileSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address."),
});

export const changePasswordSchema = z.object({
    oldPassword: z
        .string()
        .trim()
        .min(8, "Password must be atleast 8 characters long.")
        .max(32, "Password cannot exceed 32 characters."),

    newPassword: z
        .string()
        .trim()
        .min(8, "New Password must be atleast 8 characters long.")
        .max(32, "New Password cannot exceed 32 characters."),

    confirmPassword: z
        .string()
        .trim()
        .min(8, "Confirm Password must be atleast 8 characters long.")
        .max(32, "Confirm Password cannot exceed 32 characters.")
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "Old password and new password cannot be same.",
        path: ["newPassword"],
    });