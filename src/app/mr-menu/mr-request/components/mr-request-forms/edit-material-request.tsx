"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { Combobox } from "./_sub-components/combobox";
import { formFieldsSchema, MaterialRateValues } from "./schema";
import { unitOfMeasurement } from "./constants";
import { FormFields } from "./types";
import { MaterialOption } from "../mr-request-table/types";

interface EditMaterialRequestProps {
  data: MaterialRateValues;
  materialOption: MaterialOption[];
  onUpdate: (
    reqId: string,
    srNo: string,
    updates: Partial<MaterialRateValues>,
  ) => void;
}

export function EditMaterialRequest({
  data,
  materialOption,
  onUpdate,
}: EditMaterialRequestProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: {
      materialCode: data.materialCode || "",
      description: data.description || "",
      qtyReq: data.qtyReq || "",
      uom: data.uom || "",
      purpose: data.purpose || "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        materialCode: data.materialCode || "",
        description: data.description || "",
        qtyReq: data.qtyReq || "",
        uom: data.uom || "",
        purpose: data.purpose || "",
      });
    }
  }, [open, data, form]);

  // ==================== Material Selection Handlers ====================

  const handleMaterialCodeChange = (code: string) => {
    const selectedMaterial = materialOption.find(
      (m) => m.materialCode === code,
    );

    if (selectedMaterial) {
      form.setValue("materialCode", code, { shouldValidate: true });
      form.setValue("description", selectedMaterial.description || "");
    }
  };

  const handleDescriptionChange = (description: string) => {
    const selectedMaterial = materialOption.find(
      (m) => m.description === description,
    );

    if (selectedMaterial) {
      form.setValue("description", description, { shouldValidate: true });
      form.setValue("materialCode", selectedMaterial.materialCode || "");
    }
  };

  // ==================== Save Handler ====================

  const handleSave = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please fix validation errors before saving.");
      return;
    }

    const formValues = form.getValues();

    const updates: Partial<MaterialRateValues> = {
      materialCode: formValues.materialCode,
      description: formValues.description,
      qtyReq: formValues.qtyReq,
      uom: formValues.uom,
      purpose: formValues.purpose,
    };

    onUpdate(data.reqId, data.srNo, updates);
    toast.success("Material request updated successfully");
    setOpen(false);
  };

  const handleDialogClose = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          aria-label="Edit material request"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material Request</DialogTitle>
        </DialogHeader>

        {/* Request Info */}
        <div className="space-y-2 py-2 text-sm bg-muted/50 rounded-md p-3">
          <div className="flex gap-4">
            <div>
              <span className="font-medium text-muted-foreground">
                Request ID:
              </span>{" "}
              <span className="font-mono">{data.reqId}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">SR No:</span>{" "}
              <span className="font-mono">{data.srNo}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* Material Code */}
            <FormField
              control={form.control}
              name="materialCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Code</FormLabel>
                  <FormControl>
                    <Combobox
                      options={(materialOption || []).map((m) => ({
                        value: m.materialCode,
                        label: m.materialCode,
                      }))}
                      value={field.value}
                      onValueChange={handleMaterialCodeChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Combobox
                      options={(materialOption || []).map((m) => ({
                        value: m.description,
                        label: m.description,
                      }))}
                      value={field.value}
                      onValueChange={handleDescriptionChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity & UOM */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qtyReq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Required</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uom"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOfMeasurement.map((uom) => (
                            <SelectItem key={uom} value={uom}>
                              {uom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Purpose */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter purpose of request" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
