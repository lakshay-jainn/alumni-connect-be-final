import {z} from 'zod';

export const signUpSchema = z.object({
    username: z.string()
    .min(3,{message: "Username muust be atleast 3 character"})
    .max(15,{message: "Username must be less than 15 character"})
    ,
    email: z.string()
    .email({message: "Invalid email address"})
    .transform((email) => email.toLowerCase())
    ,
    password: z.string()
    .min(6,{message: "Password must be atleast 6 character"})
    .max(20,{message: "Password must be less than 20 character"})
    ,
    isAlumni: z.boolean().optional(),
})