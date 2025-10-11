

import * as z from "zod";
import { departmentConst, plantConst, roleConst } from "./constants";

export const formSchema = z
  .object({
    userId: z
     .string("required" )
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

    userName: z.string().min(6),
    empCode: z.string().min(4 , "Must be 4 digit"),
    department: z.enum(departmentConst ,  "Select Department"),
    plant: z.enum(plantConst ,"Select Plant"),
     role: z.enum(roleConst, "Select Role"),
    isActive: z.boolean()
  });


  
  export type FormSchema = z.infer<typeof formSchema>;


 