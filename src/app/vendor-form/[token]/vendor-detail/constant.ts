import z from "zod/v3";

export const DESIGNATION_OPTIONS = ["Partner", "Director", "Manager", "Other"] as const;

export const statusEnum = z.enum([
  "Resident Individual",
  "Non-Resident",
  "Foreign Nation",
]);

export const constitutionEnum = z.enum([
  "Public Ltd",
  "Private Ltd",
  "LLP",
  "Firm",
  "Individual",
]);

export const designationEnum = z.enum(["Partner", "Director", "Manager","Other"]);
export const STATUS_OPTIONS = [
  { label: "Resident Individual", value: "Resident Individual" },
  { label: "Non-Resident", value: "Non-Resident" },
  { label: "Foreign Nation", value: "Foreign Nation" },
] as const;

export const CONSTITUTION_OPTIONS = [
 { label: "Public Ltd", value: "Public Ltd"},
 { label:"Private Ltd",value: "Private Ltd"},
  {label:"LLP", value: "LLP"},
  {label:"Firm", value: "Firm"},
  { label: "Individual", value:"Individual"}
] as const;
