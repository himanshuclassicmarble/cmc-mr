import z from "zod/v3";
import { constitutionEnum, designationEnum, statusEnum, yesNoEnum } from "./constant";

export const formSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
   pin: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    district: z.string().min(1),
  dobdoi: z.coerce.date(),
  status: statusEnum,
  constitution: constitutionEnum,
  proprietorname: z.string().min(1),
  designation: designationEnum,
  mobileno: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email(),
  itr: z
      .array(
        z.object({
          ackNo: z.string().min(1, "ITR Acknowledge No is required"),
          date: z.coerce.date(),
        })
      )
      .max(3),
  
    pan: z.any().refine((f) => f && f.length > 0, "PAN file is required"),
    tan: z.any().refine((f) => f && f.length > 0, "TAN file is required"),
  
    gstregno: z.string().min(1),
    gstcertificate: z
      .any()
      .refine((f) => f && f.length > 0, "GST Certificate is required"),
  
    msmeregno: z.string().min(1),
    msmecertificate: z
      .any()
      .refine((f) => f && f.length > 0, "MSME Certificate is required"),
  
    panLinkedWithAadhaar: yesNoEnum,
     bankname: z.string().min(1, "Bank Name is required"),
      cancelcheque: z
        .any()
        .refine(
          (files) => files && files.length > 0,
          "Cancelled Cheque is required"
        ),
      branch: z.string().min(1, "Branch is required"),
      ifsccode: z.string().min(1, "IFSC Code is required"),
      accounttype: z.string().min(1, "Account Type is required"),
      digit: z.string().min(9, "MICR Code must be 9 digits").max(9),
      accountno: z.string().min(1, "Account No is required"),
})