import z from "zod/v3";

export const formSchema = z.object({
  materialCode: z
    .string({ invalid_type_error: "Material Code must be a number" })
    .regex(/^\d{8}$/, { message: "Must be exactly 8 digits" }),
  materialType: z.enum(["abc", "xyz"], {
    required_error: "Material Type is required",
  }),
  materialGroup: z.enum(["sm", "large"], {
    required_error: "Material Group is required",
  }),
  buom: z.enum(["kg", "M", "L"], {
    required_error: "Base Unit of Measure is required",
  }),
  materialDescription: z.string().min(5, "Too short").max(50, "Too long"),
});

export type FormSchema = z.infer<typeof formSchema>;
