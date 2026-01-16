import z from "zod/v3";

export const yesNoEnum = z.enum(["Yes", "No"]);
export const plannedITRYears = [
  { year: "2024–25" },
  { year: "2023–24" },
];
