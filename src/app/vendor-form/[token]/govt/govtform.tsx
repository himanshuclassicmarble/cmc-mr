"use client";

import { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  CalendarIcon,
  Paperclip,
} from "lucide-react";
import { format } from "date-fns";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { formSchema, GovtCompliancesForm } from "./schema";
import { plannedITRYears } from "./constant";
import { useVendorForm } from "@/hooks/vendorcontext";

export type GovtFormHandle = {
  submit: () => void;
};

type GovtFormProps = {
  onNext: () => void;
};

const GovtForm = forwardRef<GovtFormHandle, GovtFormProps>(
  ({ onNext }, ref) => {
    const { vendor, govtForm, setGovtForm, completeStep } = useVendorForm();

    const form = useForm<GovtCompliancesForm>({
      resolver: zodResolver(formSchema),
      defaultValues: govtForm || {
        panLinkedWithAadhaar: "Yes" as const,
        msmeregister: "No" as const,
        pan: "",
        panFile: undefined,
        itr: plannedITRYears.map((y) => ({
          year: y.year.replace("–", "-") as "2024-25" | "2023-24",
          ackNo: "",
          date: undefined,
        })),
      },
    });

    useEffect(() => {
      if (govtForm) {
        Object.keys(govtForm).forEach((key) => {
          form.setValue(key as any, govtForm[key as keyof GovtCompliancesForm]);
        });
      }
    }, [govtForm, form]);

    const msmeregister = form.watch("msmeregister");
    const showGST = vendor?.constitution !== "Individual";

    const onSubmit = (values: GovtCompliancesForm) => {
      setGovtForm(values);
      completeStep("govt");
      toast.success("Government compliance details saved");
      onNext();
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(onSubmit, (errors) => {
          console.error("Govt Form Errors:", errors);
          toast.error("Please upload all required documents and fill details.");
        })();
      },
    }));

    // Helper to render file upload button
    const FileUploadTrigger = ({
      fieldName,
      id,
    }: {
      fieldName: "panFile" | "tanFile" | "gstFile" | "msmeFile";
      id: string;
    }) => {
      const file = form.watch(fieldName) as File | undefined;
      const hasError = !!form.formState.errors[fieldName];

      return (
        <div className="flex flex-col items-end">
          <input
            type="file"
            id={id}
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                form.setValue(fieldName, selectedFile as any, {
                  shouldValidate: true,
                });
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "shrink-0",
              file && "border-green-600 bg-green-50 text-green-600",
              hasError && "border-red-500 bg-red-50 text-red-500",
            )}
            onClick={() => document.getElementById(id)?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          {file?.name && (
            <span className="text-[10px] text-muted-foreground mt-1 absolute -bottom-4 right-0 truncate max-w-[100px]">
              {file.name}
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="w-full">
        <Form {...form}>
          <form className="flex flex-col gap-8">
            {/* SECTION 1: IDENTITY & TAXATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Tax & Identity
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    PAN Number & Document
                  </FieldLabel>
                  <div className="flex gap-2 relative">
                    <Input
                      {...form.register("pan")}
                      placeholder="ABCDE1234F"
                      className="uppercase flex-1"
                    />
                    <FileUploadTrigger fieldName="panFile" id="pan-upload" />
                  </div>
                  <FieldError>
                    {form.formState.errors.pan?.message ||
                      (form.formState.errors.panFile?.message as string)}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>PAN Linked with Aadhaar?</FieldLabel>
                  <RadioGroup
                    value={form.watch("panLinkedWithAadhaar")}
                    onValueChange={(v) =>
                      form.setValue("panLinkedWithAadhaar", v as any)
                    }
                    className="flex gap-4 border rounded-md p-2 h-10 items-center px-4"
                  >
                    {["Yes", "No"].map((v) => (
                      <label
                        key={v}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <RadioGroupItem value={v} /> {v}
                      </label>
                    ))}
                  </RadioGroup>
                </Field>
              </div>

              {showGST && (
                <Field>
                  <FieldLabel>GST Registration & Certificate</FieldLabel>
                  <div className="flex gap-2 relative">
                    <Input
                      {...form.register("gstregno")}
                      placeholder="22AAAAA0000A1Z5"
                      className="flex-1"
                    />
                    <FileUploadTrigger fieldName="gstFile" id="gst-upload" />
                  </div>
                  <FieldError>
                    {form.formState.errors.gstregno?.message}
                  </FieldError>
                </Field>
              )}

              <Field>
                <FieldLabel>TAN Number & Document</FieldLabel>
                <div className="flex gap-2 relative">
                  <Input
                    {...form.register("tan")}
                    placeholder="ABCD12345E"
                    className="uppercase flex-1"
                  />
                  <FileUploadTrigger fieldName="tanFile" id="tan-upload" />
                </div>
                <FieldError>
                  {form.formState.errors.tan?.message ||
                    (form.formState.errors.tanFile?.message as string)}
                </FieldError>
              </Field>
            </div>

            <Separator />

            {/* SECTION 2: MSME COMPLIANCE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  MSME Status
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-end">
                <Field>
                  <FieldLabel>Are you MSME Registered?</FieldLabel>
                  <RadioGroup
                    value={msmeregister}
                    onValueChange={(v) =>
                      form.setValue("msmeregister", v as any)
                    }
                    className="flex gap-4 border rounded-md p-2 h-10 items-center px-4"
                  >
                    {["Yes", "No"].map((v) => (
                      <label
                        key={v}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <RadioGroupItem value={v} /> {v}
                      </label>
                    ))}
                  </RadioGroup>
                </Field>

                {msmeregister === "Yes" && (
                  <Field className="animate-in zoom-in-95 duration-200">
                    <FieldLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      MSME No & Certificate
                    </FieldLabel>
                    <div className="flex gap-2 relative">
                      <Input
                        {...form.register("msmeregno")}
                        placeholder="UDYAM-XX-00-0000000"
                        className="flex-1"
                      />
                      <FileUploadTrigger
                        fieldName="msmeFile"
                        id="msme-upload"
                      />
                    </div>
                    <FieldError>
                      {form.formState.errors.msmeFile?.message as string}
                    </FieldError>
                  </Field>
                )}
              </div>
            </div>

            <Separator />

            {/* SECTION 3: ITR FILINGS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  ITR Filings
                </h3>
              </div>

              <div className="grid gap-6">
                {plannedITRYears.map((item, index) => (
                  <div
                    key={item.year}
                    className="grid md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-dashed"
                  >
                    <input
                      type="hidden"
                      {...form.register(`itr.${index}.year`)}
                      value={item.year.replace("–", "-")}
                    />
                    <Field>
                      <FieldLabel>ITR Ack No. ({item.year})</FieldLabel>
                      <Input
                        {...form.register(`itr.${index}.ackNo`)}
                        placeholder="Acknowledgement Number"
                      />
                      <FieldError>
                        {form.formState.errors.itr?.[index]?.ackNo?.message}
                      </FieldError>
                    </Field>

                    <Field>
                      <FieldLabel>Date of Filing</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !form.watch(`itr.${index}.date`) &&
                                "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.watch(`itr.${index}.date`) ? (
                              format(
                                new Date(form.watch(`itr.${index}.date`)!),
                                "PPP",
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              form.watch(`itr.${index}.date`)
                                ? new Date(form.watch(`itr.${index}.date`)!)
                                : undefined
                            }
                            onSelect={(date) =>
                              form.setValue(`itr.${index}.date`, date as any, {
                                shouldValidate: true,
                              })
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FieldError>
                        {form.formState.errors.itr?.[index]?.date?.message}
                      </FieldError>
                    </Field>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  <span className="font-bold">Note:</span> If ITR is not filed,
                  TDS may be deducted at higher rates under sections
                  206AB/206CCA.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
    );
  },
);

GovtForm.displayName = "GovtForm";
export default GovtForm;
