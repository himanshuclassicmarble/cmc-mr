"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  UserCircle2,
  Briefcase,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import z from "zod/v3";
import { formSchema, VendorDetailForm } from "./schema";
import {
  CONSTITUTION_OPTIONS,
  DESIGNATION_OPTIONS,
  STATUS_OPTIONS,
} from "./constant";
import { useVendorForm } from "@/hooks/vendorcontext";

export type VendorDetailsHandle = {
  submit: () => void;
};

type VendorDetailsProps = {
  onNext: () => void;
};

const VendorDetails = forwardRef<VendorDetailsHandle, VendorDetailsProps>(
  ({ onNext }, ref) => {
    const { vendor, setVendor, completeStep } = useVendorForm();

    const form = useForm<VendorDetailForm>({
      resolver: zodResolver(formSchema),
      defaultValues: vendor || {
        dobdoi: new Date(),
      },
    });

    // Load existing data when component mounts
    useEffect(() => {
      if (vendor) {
        Object.keys(vendor).forEach((key) => {
          const value = vendor[key as keyof VendorDetailForm];
          if (key === "dobdoi" && value) {
            // Ensure date is converted to Date object
            form.setValue("dobdoi", new Date(value));
          } else {
            form.setValue(key as any, value);
          }
        });
      }
    }, [vendor, form]);

    /* ---------------- PINCODE AUTO-FILL ---------------- */
    useEffect(() => {
      const subscription = form.watch((value, { name }) => {
        if (name === "pin" && value.pin?.length === 6) {
          fetch(`https://api.postalpincode.in/pincode/${value.pin}`)
            .then((res) => res.json())
            .then((data) => {
              const postOffice = data?.[0]?.PostOffice?.[0];
              if (!postOffice) return;

              form.setValue("state", postOffice.State);
              form.setValue("district", postOffice.District);
              form.setValue("city", postOffice.City || postOffice.Name);
            });
        }
      });
      return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      // Save to context (allows editing)
      setVendor(values);

      // Mark step as completed (validates for next step access)
      completeStep("vendor");

      toast.success("Vendor details saved");
      onNext();
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(
          (values) => onSubmit(values),
          (errors) => {
            console.error("Vendor Form Errors:", errors);
            toast.error("Please fill in all required fields correctly.");
          },
        )();
      },
    }));

    return (
      <div className="w-full">
        <Form {...form}>
          <form className="flex flex-col gap-8">
            {/* SECTION 1: BASIC INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Company Profile
                </h3>
              </div>

              <div className="grid gap-4">
                <Field>
                  <FieldLabel>Legal Name of Vendor</FieldLabel>
                  <Input
                    {...form.register("name")}
                    placeholder="Enter legal entity name"
                  />
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </Field>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* DATE PICKER WITH CALENDAR */}
                  <Field>
                    <FieldLabel>Date of Birth / Incorporation</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("dobdoi") && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("dobdoi") ? (
                            format(new Date(form.watch("dobdoi")), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            form.watch("dobdoi")
                              ? new Date(form.watch("dobdoi"))
                              : undefined
                          }
                          onSelect={(date) => {
                            form.setValue("dobdoi", date || new Date());
                          }}
                          initialFocus
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError>
                      {form.formState.errors.dobdoi?.message}
                    </FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>Mobile Number</FieldLabel>
                    <Input
                      type="number"
                      {...form.register("mobileno")}
                      placeholder="Primary contact number"
                    />
                    <FieldError>
                      {form.formState.errors.mobileno?.message}
                    </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>Official Email</FieldLabel>
                    <Input
                      {...form.register("email")}
                      placeholder="vendor@company.com"
                    />
                    <FieldError>
                      {form.formState.errors.email?.message}
                    </FieldError>
                  </Field>
                </div>
              </div>
            </div>

            <Separator />

            {/* SECTION 2: ADDRESS DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Registered Office
                </h3>
              </div>

              <div className="grid gap-4">
                <Field>
                  <FieldLabel>Street Address</FieldLabel>
                  <Input
                    {...form.register("address")}
                    placeholder="Flat/Plot No., Building Name, Area"
                  />
                  <FieldError>
                    {form.formState.errors.address?.message}
                  </FieldError>
                </Field>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Field>
                    <FieldLabel>Pincode</FieldLabel>
                    <Input
                      {...form.register("pin")}
                      placeholder="6-digit PIN"
                    />
                    <FieldError>
                      {form.formState.errors.pin?.message}
                    </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input {...form.register("city")} />
                    <FieldError>
                      {form.formState.errors.city?.message}
                    </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>District</FieldLabel>
                    <Input {...form.register("district")} />
                    <FieldError>
                      {form.formState.errors.district?.message}
                    </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>State</FieldLabel>
                    <Input {...form.register("state")} />
                    <FieldError>
                      {form.formState.errors.state?.message}
                    </FieldError>
                  </Field>
                </div>
              </div>
            </div>

            <Separator />

            {/* SECTION 3: LEGAL STATUS */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <UserCircle2 className="w-5 h-5" />
                  <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                    Status
                  </h3>
                </div>
                <RadioGroup
                  value={form.watch("status")}
                  onValueChange={(v) => form.setValue("status", v as any)}
                  className="grid gap-2 border rounded-lg p-4 bg-muted/20"
                >
                  {STATUS_OPTIONS.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-3 cursor-pointer text-sm"
                    >
                      <RadioGroupItem value={item.value} />
                      {item.label}
                    </label>
                  ))}
                </RadioGroup>
                <FieldError>{form.formState.errors.status?.message}</FieldError>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                    Constitution
                  </h3>
                </div>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <RadioGroup
                    className="grid grid-cols-2 gap-2"
                    value={form.watch("constitution")}
                    onValueChange={(v) =>
                      form.setValue("constitution", v as any)
                    }
                  >
                    {CONSTITUTION_OPTIONS.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer text-sm"
                      >
                        <RadioGroupItem value={item.value} />
                        {item.label}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <FieldError>
                  {form.formState.errors.constitution?.message}
                </FieldError>
              </div>
            </div>

            <Separator />

            {/* SECTION 4: CONTACT PERSON */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <UserCircle2 className="w-5 h-5" />
                <h3 className="font-semibold italic uppercase tracking-wider text-sm">
                  Authorized Contact
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    {...form.register("contactpersonname")}
                    placeholder="Name of contact person"
                  />
                  <FieldError>
                    {form.formState.errors.contactpersonname?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Mobile Number</FieldLabel>
                  <Input
                    type="number"
                    {...form.register("contactpersonmobileno")}
                    placeholder="Direct mobile line"
                  />
                  <FieldError>
                    {form.formState.errors.contactpersonmobileno?.message}
                  </FieldError>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Designation</FieldLabel>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select
                      value={form.watch("designation")}
                      onValueChange={(value) => {
                        form.setValue("designation", value as any);
                        if (value !== "Other")
                          form.setValue("designationother", "");
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESIGNATION_OPTIONS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {form.watch("designation") === "Other" && (
                      <Input
                        placeholder="Specify designation"
                        className="flex-1 animate-in slide-in-from-left-2 duration-200"
                        {...form.register("designationother")}
                      />
                    )}
                  </div>
                  <FieldError>
                    {form.formState.errors.designation?.message ||
                      form.formState.errors.designationother?.message}
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

VendorDetails.displayName = "VendorDetails";
export default VendorDetails;
