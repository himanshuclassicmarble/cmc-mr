import { z } from "zod";

export const materialRateSchema = z.object({
  requestId: z.string().optional(),
  serialNumber: z.number().optional(),
  itemCode: z.string().min(1, "Item Code is required"),
  details: z.string().optional(),
  quantityRequired: z.number().min(1, "Quantity must be at least 1"),
  unitOfMeasurement: z.string().optional(),
  purpose: z.string().min(3, "Purpose must be at least 3 characters"),
});

export type MaterialRateFormValues = z.infer<typeof materialRateSchema>;
