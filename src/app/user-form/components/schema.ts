

import * as z from "zod";
import { departmentConst, plantConst } from "./constants";

export const formSchema = z
  .object({
    userId: z
     .string("required" )
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

    userName: z.string().min(6),
    empCode: z.string().min(4 , "Must be 4 digit"),
    department: z.enum(departmentConst ,  "Select Department"),
    plant: z.enum(plantConst ,"Select Plant"),
    hod: z
     .string({ message: "required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{message: "Invalid email format"}),
  })
  .refine((data) => data.userId !== data.hod, {
    message: "UserId and Reporting Manager email cannot be same",
    path: ["hod"],
  });


  
  export type FormSchema = z.infer<typeof formSchema>;