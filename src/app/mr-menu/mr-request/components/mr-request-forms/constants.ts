import { FormFields } from "./types";

// Unit of Measurement
export const unitOfMeasurement = ["L", "M", "NOS", "SET", "FT", "KG", "PAC"];

// Material Groups
export const materialGroups = ["SM", "LG", "XL"];

// Material Types
export const materialTypes = ["ERSA", "UNBW"];

// Status options
export const statusConst = [
  "Open",
  "Partially Open",
  "Closed",
  "pending",
  "rejected",
  "approved",
];

export const DEFAULT_FORM_VALUES: FormFields = {
  materialCode: "",
  description: "",
  qtyReq: "",
  uom: "L",
  purpose: "",
};
