import z from "zod/v3";

export const DESIGNATION_OPTIONS = ["Partner", "Director", "Manager"] as const;

export const statusEnum = z.enum([
  "Resident Individual",
  "Non-Resident",
  "Foreign National",
]);

export const constitutionEnum = z.enum([
  "Public Ltd",
  "Private Ltd",
  "LLP",
  "Firm",
  "Individual",
]);

export const designationEnum = z.enum(["Partner", "Director", "Manager"]);
export const yesNoEnum = z.enum(["Yes", "No"]);