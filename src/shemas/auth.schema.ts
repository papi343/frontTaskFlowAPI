import { z } from "zod";



export const loginShema = z.object({
    email: z.string().email('email invalid'),
    password: z.string().min(8, "le mot de passe doit contenir au minimum 8 caracte"),
});

export const registerShema = z.object({
    email: z.string().email('email invalid'),
    password: z.string().min(8, "le mot de passe doit contenir au minimum 8 caracte"),
    name: z.string().min(3, "le nom doit contenir au minimum 3 caracte"),

});