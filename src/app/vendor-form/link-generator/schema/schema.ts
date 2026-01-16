import {
  departmentConst,
  plantConst,
} from "@/app/user-screen/components/constants";
import { z } from "zod";

export const LinkSchema = z.object({
  id: z.string(),

  token: z.string(),

  createdByEmail: z.string().email("Invalid email format"),

  department: z.enum(departmentConst),

  plant: z.enum(plantConst),

  empCode: z
    .string()
    .min(4, "Employee Code must be at least 4 digits")
    .regex(/^[0-9]+$/, { message: "Employee Code must be numeric" }),

  status: z.enum(["active", "expired", "revoked", "submitted"]),

  expiresAt: z.string(),
  createdAt: z.string(),
});

export type LinkSchemaType = z.infer<typeof LinkSchema>;
