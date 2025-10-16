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
  materialGroup: z.string().refine((val) => materialGroups.includes(val), {
    message: "Material Group is required",
  }),
  qtyReq: z.string().min(1, "Required"),
  qtyApproved: z.string().optional(),
  qtyIssued: z.string().optional(),
  uom: z.string().refine((val) => unitOfMeasurement.includes(val), {
    message: "Unit of Measurement is required",
  }),
  materialType: z.string().refine((val) => materialTypes.includes(val), {
    message: "Material Type is required",
  }),
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

// Schema for the Form fields in the create and edit form for the material request
export const formFieldsSchema = materialRateSchema.pick({
  materialCode: true,
  description: true,
  qtyReq: true,
  uom: true,
  purpose: true,
  materialGroup: true,
  materialType: true,
});
