import e from "express";
import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["user", "admin"]).optional(),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        username: z.string().min(3).max(30).optional(),
        email: z.string().email().optional(),
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;