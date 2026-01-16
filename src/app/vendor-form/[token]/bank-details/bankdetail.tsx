"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Landmark, CreditCard, FileCheck, Info } from "lucide-react";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BankDetailsFormType, formSchema } from "./schema";
import { Account_Type } from "./constant";
import { useVendorForm } from "@/hooks/vendorcontext";

export type BankDetailsHandle = {
  submit: () => void;
};

type BankDetailsProps = {
  onNext: () => void;
};

const BankDetails = forwardRef<BankDetailsHandle, BankDetailsProps>(
  ({ onNext }, ref) => {
    const { setBankDetails, bankDetails } = useVendorForm();

    const form = useForm<BankDetailsFormType>({
      resolver: zodResolver(formSchema),
      defaultValues: bankDetails || {
        accounttype: "Saving",
        ifsccode: "",
        bankname: "",
        branch: "",
        accountno: "",
        digit: "",
        cancelcheque: [],
      },
    });

    const ifsc = form.watch("ifsccode");

    /* ---------------- POPULATE FORM ON EDIT ---------------- */
    useEffect(() => {
      if (bankDetails) {
        Object.keys(bankDetails).forEach((key) => {
          const value = bankDetails[key as keyof BankDetailsFormType];
          form.setValue(key as keyof BankDetailsFormType, value as any);
        });
      }
    }, [bankDetails, form]);

    /* ---------------- IFSC LOOKUP ---------------- */
    useEffect(() => {
      if (ifsc && ifsc.length === 11) {
        // Only auto-fetch if bank details are empty (not in edit mode with existing data)
        if (!form.getValues("bankname") && !form.getValues("branch")) {
          fetchBankDetails(ifsc.toUpperCase());
        }
      }
    }, [ifsc]);

    const fetchBankDetails = async (ifsc: string) => {
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        form.setValue("bankname", data.BANK);
        form.setValue("branch", data.BRANCH);
        form.setValue("digit", data.MICR ?? "");
        toast.success("Bank details fetched successfully");
      } catch {
        toast.error("Invalid IFSC code or network error");
        form.setValue("bankname", "");
        form.setValue("branch", "");
        form.setValue("digit", "");
      }
    };

    const handleFileChange = (files: FileList | null) => {
      form.setValue("cancelcheque", files ? Array.from(files) : []);
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      setBankDetails(values);
      toast.success("Bank details saved successfully");
      onNext();
    };

    /* ---------------- EXPOSE SUBMIT ---------------- */
    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(
          (values) => onSubmit(values),
          (errors) => {
            console.error("Bank Form Errors:", errors);
            toast.error("Please verify your bank details.");
          },
        )();
      },
    }));

    return (
      <div className="w-full">
        <Form {...form}>
          <form className="flex flex-col gap-8">
            {/* SECTION 1: BANK IDENTIFICATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Landmark className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Branch Locator
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>IFSC Code</FieldLabel>
                  <Input
                    placeholder="e.g. HDFC0001234"
                    className="uppercase font-mono"
                    {...form.register("ifsccode")}
                    onInput={(e) =>
                      form.setValue(
                        "ifsccode",
                        (e.target as HTMLInputElement).value.toUpperCase(),
                      )
                    }
                  />
                  <FieldError>
                    {form.formState.errors.ifsccode?.message}
                  </FieldError>
                </Field>

                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700">
                  <Info className="w-4 h-4 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    Enter an 11-digit IFSC code to automatically fetch Bank and
                    Branch details.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>Bank Name</FieldLabel>
                  <Input
                    readOnly
                    placeholder="Fetched from IFSC"
                    className="bg-muted/50 cursor-not-allowed italic"
                    {...form.register("bankname")}
                  />
                </Field>

                <Field>
                  <FieldLabel>Branch</FieldLabel>
                  <Input
                    readOnly
                    placeholder="Fetched from IFSC"
                    className="bg-muted/50 cursor-not-allowed italic"
                    {...form.register("branch")}
                  />
                </Field>
              </div>
            </div>

            <Separator />

            {/* SECTION 2: ACCOUNT DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Account Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>Account Number</FieldLabel>
                  <Input
                    {...form.register("accountno")}
                    placeholder="Enter your full account number"
                  />
                  <FieldError>
                    {form.formState.errors.accountno?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>9-Digit MICR Code</FieldLabel>
                  <Input
                    readOnly
                    placeholder="Auto-filled"
                    className="bg-muted/50 cursor-not-allowed font-mono"
                    {...form.register("digit")}
                  />
                </Field>
              </div>

              <Field className="md:w-1/2">
                <FieldLabel>Account Type</FieldLabel>
                <Select
                  value={form.watch("accounttype")}
                  onValueChange={(v) => form.setValue("accounttype", v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Account_Type.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>
                  {form.formState.errors.accounttype?.message}
                </FieldError>
              </Field>
            </div>

            <Separator />

            {/* SECTION 3: VERIFICATION DOCUMENTS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <FileCheck className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Verification
                </h3>
              </div>

              <div className="p-6 border-2 border-dashed rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <Field>
                  <FieldLabel className="mb-2">
                    Upload Cancelled Cheque / Passbook
                  </FieldLabel>

                  {/* Show existing files if in edit mode */}
                  {bankDetails?.cancelcheque &&
                    bankDetails.cancelcheque.length > 0 && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-medium text-blue-700 mb-1">
                          Previously uploaded files:
                        </p>
                        <ul className="text-xs text-blue-600 space-y-1">
                          {bankDetails.cancelcheque.map((file, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <FileCheck className="w-3 h-3" />
                              {file.name || `File ${idx + 1}`}
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-blue-500 mt-2 italic">
                          Upload new files to replace existing ones
                        </p>
                      </div>
                    )}

                  <Input
                    type="file"
                    className="bg-background cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Max file size: 5MB. Supported formats: PDF, JPG, PNG.
                  </p>
                  <FieldError>
                    {form.formState.errors.cancelcheque?.message}
                  </FieldError>
                </Field>
              </div>
            </div>
          </form>
        </Form>
      </div>
    );
  },
);

BankDetails.displayName = "BankDetails";
export default BankDetails;
