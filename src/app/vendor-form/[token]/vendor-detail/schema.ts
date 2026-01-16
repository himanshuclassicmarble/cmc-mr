import z from "zod/v3";
import { constitutionEnum, statusEnum } from "./constant";

export const formSchema = z
  .object({
    name: z.string().min(1),
    address: z.string().min(1, "Address is required"),
    pin: z.string().min(1, "PIN is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    dobdoi: z.coerce.date(),

    status: statusEnum,
    constitution: constitutionEnum,

    contactpersonname: z.string().min(1),
    contactpersonmobileno: z
      .string()
      .length(10, "Mobile number must be 10 digits"),

    mobileno: z.string().length(10, "Mobile number must be 10 digits"),
    email: z.string().email(),

    designation: z.string().nonempty("Designation is required"),
    designationother: z.string()
  })
  .refine(
    (data) => {
      if (data.designation === "Other") {
        return !!data.designationother?.trim();
      }
      return true;
    },
    {
      message: "Please enter designation",
      path: ["designationother"],
    }
  );

export type VendorDetailForm = z.infer<typeof formSchema>;
