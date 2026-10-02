import { z } from "zod";

export const taskSchema = z.object({
    titre: z
        .string()
        .min(2, "Le titre doit contenir au moins 2 caractères")
        .max(150, "Le titre ne peut pas dépasser 150 caractères"),

    description: z
        .string()
        .max(
            1000,
            "La description ne peut pas dépasser 1000 caractères",
        )
        .optional(),

    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "DONE",
    ]),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
    ]),

    assigneeId: z.string().optional(),
});