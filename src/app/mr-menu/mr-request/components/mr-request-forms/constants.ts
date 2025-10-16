import { FormFields } from "./types";

// Material details (optional, for comboboxes)
export const materialDetailsConst = ["Some Details", "SomeDetails 2"];

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
  uom: "",
  purpose: "",
  materialGroup: "",
  materialType: "",
};
