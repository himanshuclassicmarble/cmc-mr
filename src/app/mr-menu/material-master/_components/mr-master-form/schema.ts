import z from "zod/v3";
import { buomConst, materialGroupConst, materialTypeConst } from "./constants";

export const formSchema = z.object({
  materialCode: z
    .string({ invalid_type_error: "Material Code must be a number" })
    .regex(/^\d{8}$/, { message: "Must be exactly 8 digits" }),

  materialType: z.enum(materialTypeConst, {
    required_error: "Material Type is required",
  }),

  materialGroup: z.enum(materialGroupConst, {
    required_error: "Material Group is required",
  }),

  uom: z.enum(buomConst, {
    required_error: "Base Unit of Measure is required",
  }),

  materialDescription: z.string().min(5, "Too short").max(50, "Too long"),
});

export type MRMasterSchema = z.infer<typeof formSchema>;
