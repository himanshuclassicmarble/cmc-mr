"use client";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

import z from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ACCOUNT_GROUPS,
  PAYMENT_TERMS,
  PLANT_DATA,
  PURCHASING_ORG,
  RECIPIENT_TYPE_INVOICE,
  RECIPIENT_TYPE_PAYMENT,
  RECON_ACCOUNTS,
  WHT_INV,
  WHT_PAY,
} from "./constant";
import { formSchema, InternalForm } from "./schema";

export default function MyForm() {
  const form = useForm<InternalForm>({
    resolver: zodResolver(formSchema),
  });

  const selectedType = form.watch("wtaxtypeinv")?.split("-")[0];
  const selectedInvCodes = WHT_INV.filter((item) => item.type === selectedType);

  const selectedTypepay = form.watch("wtaxtypepay")?.split("-")[0];
  const selectedPayCodes = WHT_PAY.filter(
    (item) => item.type === selectedTypepay
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 text-sm">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch {
      toast.error("Failed to submit the form");
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-4 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="max-w-3xl mx-auto space-y-6 bg-background p-8 rounded-2xl shadow-lg border">
            <h2 className="text-2xl font-semibold text-center">
              Internal Form
            </h2>

            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 -mt-6">
              <div className="md:col-span-6">
                <Controller
                  name="accountgroup"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="flex flex-row  gap-3">
                      <FieldLabel className="w-32">Account Group</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="max-w-40">
                          <SelectValue>
                            {ACCOUNT_GROUPS.find((d) => d.code === field.value)
                              ?.code || ""}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {ACCOUNT_GROUPS.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.code} {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldError />
                    </Field>
                  )}
                />
              </div>
              <div className="md:col-span-6">
                <Controller
                  name="reconaccount"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="flex flex-row gap-3">
                      <FieldLabel className="w-32">Recon Account</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="max-w-40">
                          <SelectValue>
                            {RECON_ACCOUNTS.find((d) => d.code === field.value)
                              ?.code || ""}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {RECON_ACCOUNTS.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.code} {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldError />
                    </Field>
                  )}
                />
              </div>
            </div>
            {/*Row 2*/}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 -mt-8">
              <div className="md:col-span-6">
                <Controller
                  name="plant"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="flex flex-row  gap-3">
                      <FieldLabel className="w-32">Plant</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="max-w-40">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {PLANT_DATA.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldError />
                    </Field>
                  )}
                />
              </div>
              <div className="md:col-span-6">
                <Controller
                  name="purchasingorg"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="flex flex-row  gap-3">
                      <FieldLabel className="w-32">Purchasing.Org</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="max-w-40">
                          <SelectValue>
                            {PURCHASING_ORG.find((d) => d.code === field.value)
                              ?.code || ""}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {PURCHASING_ORG.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.code} {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldError />
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="border border-border p-2 rounded-md -mt-6">
              <h4 className="font-bold mb-2 p-1">Invoice:</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 p-1 items-center -mt-4">
                <div className="md:col-span-3">
                  <Controller
                    name="wtaxtypeinv"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>W/Tax Type</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("wtaxcodeinv", "");
                          }}
                        >
                          <SelectTrigger className="md:max-w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {WHT_INV.map((t) => (
                              <SelectItem
                                key={t.id}
                                value={`${t.type}-${t.code}-${t.id}`}
                              >
                                {t.type} - {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError />
                      </Field>
                    )}
                  />
                </div>

                <div className="md:col-span-3">
                  <Controller
                    name="wtaxcodeinv"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <Field>
                          <FieldLabel>W/Tax Code</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="md:max-w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedInvCodes.map((c) => (
                                <SelectItem key={c.id} value={c.code}>
                                  {c.code} - {c.label1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError />
                        </Field>
                      );
                    }}
                  />
                </div>

                <div className="md:col-span-3">
                  <Controller
                    name="recipientinvoice"
                    control={form.control}
                    render={({ field }) => (
                      <Field className="flex flex-row md:flex-col gap-2">
                        <FieldLabel className="w-32">Recipient</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="md:max-w-20">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {RECIPIENT_TYPE_INVOICE.map((d) => (
                              <SelectItem key={d.type} value={d.type}>
                                {d.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FieldError />
                      </Field>
                    )}
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex md:flex-col gap-4">
                    <FieldLabel className="whitespace-nowrap">
                      Subject
                    </FieldLabel>
                    <Checkbox checked disabled />
                  </div>
                </div>
              </div>

              <h4 className="font-bold mb-2 p-1 mt-2">Payment: </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 p-1 items-center -mt-4">
                <div className="md:col-span-3">
                  <Controller
                    name="wtaxtypepay"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>W/Tax Type</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("wtaxcodepay", "");
                          }}
                        >
                          <SelectTrigger className="md:max-w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {WHT_PAY.map((t) => (
                              <SelectItem
                                key={t.id}
                                value={`${t.type}-${t.code}-${t.id}`}
                              >
                                {t.type} - {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError />
                      </Field>
                    )}
                  />
                </div>

                <div className="md:col-span-3">
                  <Controller
                    name="wtaxcodepay"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <Field>
                          <FieldLabel>W/Tax Code</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="md:max-w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedPayCodes.map((c) => (
                                <SelectItem key={c.id} value={c.code}>
                                  {c.code} - {c.label1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError />
                        </Field>
                      );
                    }}
                  />
                </div>

                <div className="md:col-span-3">
                  <Controller
                    name="recipientpayment"
                    control={form.control}
                    render={({ field }) => (
                      <Field className="flex flex-row md:flex-col gap-2">
                        <FieldLabel className="w-32">Recipient</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="md:max-w-20">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {RECIPIENT_TYPE_PAYMENT.map((d) => (
                              <SelectItem key={d.type} value={d.type}>
                                {d.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FieldError />
                      </Field>
                    )}
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="flex flex-row md:flex-col gap-4">
                    <FieldLabel className="whitespace-nowrap">
                      Subject
                    </FieldLabel>
                    <Checkbox checked disabled />
                  </div>
                </div>
              </div>
            </div>

            <div className=" gap-6 -mt-6">
              <Controller
                name="paymentterm"
                control={form.control}
                render={({ field }) => (
                  <Field className="flex flex-row gap-3">
                    <FieldLabel className="max-w-40">Payment Term</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="max-w-40">
                        <SelectValue>
                          {PAYMENT_TERMS.find((d) => d.code === field.value)
                            ?.code || ""}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {PAYMENT_TERMS.map((d) => (
                          <SelectItem key={d.code} value={d.code}>
                            {d.code} {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FieldError />
                  </Field>
                )}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button className="" type="submit">
                Submit
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
