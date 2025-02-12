import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters!")
  .max(20, "Username must not exceed 20 characters!");

export const signupSchemaValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'Invalid e-mail address!' }),
  password: z.string().min(6, {message: 'Password must be atleast 6 characters'})
});
