import { z } from "zod";
import { departmentConst, plantConst, roleConst } from "./constants";

export const formSchema = z.object({
  authUserId: z.string().uuid(),

  email: z.string().email("Invalid email format").min(1, "Email is required"),

  userName: z
    .string()
    .min(6, "Username must be at least 6 characters")
    .regex(/^[A-Za-z ]+$/, { message: "Name must contain only letters" }),

  empCode: z
    .string()
    .min(4, "Employee Code must be at least 4 digits")
    .regex(/^[0-9]+$/, { message: "Employee Code must be numeric" }),

  department: z.enum(departmentConst),
  plant: z.enum(plantConst),
  role: z.enum(roleConst),

  hod: z.string().optional(),
  isActive: z.boolean(),
});

export type UserFormSchema = z.infer<typeof formSchema>;
