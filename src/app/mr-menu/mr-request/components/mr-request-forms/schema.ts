import { z } from "zod";
import {
  unitOfMeasurement,
  materialGroups,
  materialTypes,
  statusConst,
} from "./constants";

export const materialRateSchema = z.object({
  reqId: z.string().min(1, "Required"),
  srNo: z.string().min(1, "Required"),
  materialCode: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  materialGroup: z
    .string()
    .refine((val) => !val || materialGroups.includes(val), {
      message: "Invalid Material Group",
    })
    .optional(),
  qtyReq: z.coerce.number().min(0, "Quantity cannot be negative"),
  qtyApproved: z.coerce
    .number()
    .min(0, "Quantity cannot be negative")
    .optional(),
  qtyIssued: z.coerce.number().min(0, "Quantity cannot be negative").optional(),
  uom: z.string().refine((val) => unitOfMeasurement.includes(val), {
    message: "Unit of Measurement is required",
  }),
  materialType: z
    .string()
    .refine((val) => !val || materialTypes.includes(val), {
      message: "Invalid Material Type",
    })
    .optional(),
  purpose: z.string().min(1, "Required"),
  status: z.string().refine((val) => statusConst.includes(val), {
    message: "Status is required",
  }),
  createdDate: z.string().optional(),
  approvalDate: z.string().optional(),
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
});

export type MaterialRateValues = z.infer<typeof materialRateSchema>;

export const formFieldsSchema = z.object({
  materialCode: z.string().min(1, "Material code is required"),
  description: z.string().min(1, "Description is required"),
  qtyReq: z.number().min(0, "Quantity cannot be negative"),
  uom: z.string().min(1, "Unit of measurement is required"),
  purpose: z.string().min(1, "Purpose is required"),
});

export type FormFieldsType = z.infer<typeof formFieldsSchema>;
