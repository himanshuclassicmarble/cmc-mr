import z from "zod/v3";
import { accounttypeEnum } from "./constant";

export const formSchema = z.object({
  bankname: z.string().min(1, "Bank Name is required"),
  cancelcheque: z
    .any()
    .refine(
      (files) => files && files.length > 0,
      "Cancelled Cheque is required"
    ),
  branch: z.string().min(1, "Branch is required"),
 ifsccode: z
  .string()
  .length(11, "IFSC must be 11 characters"),
  accounttype: accounttypeEnum,
  digit: z.string().min(9, "MICR Code must be 9 digits").max(9),
  accountno: z.string().min(9, "Account number must be at least 9 digits")
  .max(18, "Account number cannot exceed 18 digits").regex(/^\d+$/, "Account number must contain only digits"),
});

export type BankDetailsFormType = z.infer<typeof formSchema>;