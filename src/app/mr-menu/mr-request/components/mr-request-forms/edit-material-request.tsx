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

import { formFieldsSchema, MaterialRateValues } from "./schema";
import { unitOfMeasurement } from "./constants";
import { EditMaterialRequestProps, FormFields } from "./types";
import { MaterialCodeSearchField } from "./_sub-components/material-code-search";
import { MaterialMaster } from "@/app/mr-menu/material-master/types";
import { Combobox } from "./_sub-components/combobox";

export function EditMaterialRequest({
  data,
  materialOption,
  onUpdate,
}: EditMaterialRequestProps) {
  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialMaster | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: {
      materialCode: data.materialCode || "",
      description: data.description || "",
      qtyReq: data.qtyReq || 0,
      uom: data.uom || "",
      purpose: data.purpose || "",
    },
    mode: "onBlur",
  });

  // description update when combobox changes
  const handleDescriptionChange = (description: string) => {
    const material = materialOption.find(
      (m) => m.materialDescription === description,
    );

    if (material) {
      form.setValue("description", description, { shouldValidate: true });
      form.setValue("materialCode", material.materialCode || "");
      form.setValue("uom", material.uom || "");
      setSelectedMaterial(material);
    }
  };

  // reset everything whenever dialog opens and auto-detect if new material
  useEffect(() => {
    if (open) {
      form.reset({
        materialCode: data.materialCode || "",
        description: data.description || "",
        qtyReq: data.qtyReq || 0,
        uom: data.uom || "",
        purpose: data.purpose || "",
      });

      // Check if this is a new material by looking for it in materialOption
      const isNewMaterial = !materialOption.some(
        (m) => m.materialCode === data.materialCode,
      );
      setNewMaterial(isNewMaterial);

      // Set selected material if it exists
      const material = materialOption.find(
        (m) => m.materialCode === data.materialCode,
      );
      setSelectedMaterial(material || null);
    }
  }, [open, data, form, materialOption]);

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
    setNewMaterial(false);
    setSelectedMaterial(null);
    setOpen(false);
  };

  const handleMaterialFound = (material: MaterialMaster) => {
    form.setValue("materialCode", material.materialCode || "");
    form.setValue("description", material.materialDescription || "");
    form.setValue("uom", material.uom || "");
    setSelectedMaterial(material);
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
            {/* Material Code Search */}
            <MaterialCodeSearchField
              name="materialCode"
              materialOptions={materialOption}
              setNewMaterial={setNewMaterial}
              onMaterialFound={handleMaterialFound}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {newMaterial ? (
                      // new material → editable input
                      <Input
                        placeholder="Enter material description"
                        {...field}
                      />
                    ) : (
                      // existing material → combobox (editable)
                      <Combobox
                        options={materialOption.map((m) => ({
                          value: m.materialDescription,
                          label: m.materialDescription,
                        }))}
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleDescriptionChange(val);
                        }}
                        disabled={false}
                      />
                    )}
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
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
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
                      {newMaterial ? (
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
                      ) : (
                        // existing material → editable input
                        <Input {...field} disabled readOnly />
                      )}
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
