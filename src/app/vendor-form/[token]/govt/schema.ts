import { z } from "zod";

export const yesNoEnum = z.enum(["Yes", "No"]);
export const itrYearEnum = z.enum(["2024-25", "2023-24"]);

export const formSchema = z
  .object({
    itr: z.array(
      z.object({
        year: itrYearEnum,
        ackNo: z.string().min(1, "ITR Acknowledge No is required"),
        date: z.coerce.date({
          error: "Filing date is required",
        }),
      }),
    ),
    pan: z
      .string()
      .length(10, "PAN must be 10 characters")
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    panFile: z.any().refine((file) => !!file, "PAN document is required"),
    panLinkedWithAadhaar: yesNoEnum,
    tan: z.string().optional(),
    tanFile: z.any().optional(),
    gstregno: z
      .string()
      .length(15, "GSTIN must be 15 characters")
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN format",
      )
      .optional()
      .or(z.literal("")),
    gstFile: z.any().optional(),
    msmeregister: yesNoEnum,
    msmeregno: z.string().optional(),
    msmeFile: z.any().optional(),
  })
  .refine(
    (data) => {
      // If MSME is "Yes", certificate is required
      if (data.msmeregister === "Yes" && !data.msmeFile) return false;
      return true;
    },
    {
      message: "MSME Certificate is required",
      path: ["msmeFile"],
    },
  );

export type GovtCompliancesForm = z.infer<typeof formSchema>;
