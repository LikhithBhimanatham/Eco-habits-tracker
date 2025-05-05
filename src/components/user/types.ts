
import { z } from "zod";

// Define the schema for user profile
export const profileSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string()
    .email({
      message: "Please enter a valid email address.",
    })
    .refine((email) => {
      // Check if it's a gmail account
      return email.toLowerCase().endsWith('@gmail.com');
    }, {
      message: "Only Gmail accounts are allowed (example@gmail.com).",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  notifications: z.boolean().default(true),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
