import { z } from "zod";

export const materialDetailsConst = ["Some Details", "SomeDetails 2"] as const;
export const unitOfMeasurement = ["L", "M","NOS","Set","FT","Kg","Pac"] as const;
export const materialRateSchema = z.object({
  requestId: z.string().optional(),
  serialNumber: z.number().optional(),
  materialCode: z.string().min(1, "Required"),
  description: z.string(),
  quantityRequired: z.number().min(1, "Atleast 1 Value"),
  unitOfMeasurement: z.enum(unitOfMeasurement),
  purpose: z.string().min(3, "must be more than 3 characters"),
});

export type MaterialRateFormValues = z.infer<typeof materialRateSchema>;




 