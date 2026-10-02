import { z } from "zod";



export const projectShema = z.object({
    name: z.string().min(1, "le nom du projet est requis").max(50, "le nom du projet doit contenir au maximum 50 caractere"),
    description: z.string()
        .max(255, "la description doit contenir au maximum 255 caractere")
        .optional(),
});