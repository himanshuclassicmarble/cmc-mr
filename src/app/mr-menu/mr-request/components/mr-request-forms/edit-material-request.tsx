"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { ListRestart, Pencil } from "lucide-react";

import { formFieldsSchema, MaterialRateValues } from "./schema";
import { unitOfMeasurement, materialGroups, materialTypes } from "./constants";
import { EditMaterialRequestProps, FormFields } from "./types";
import { MaterialCodeSearchField } from "./_sub-components/material-code-search";
import { MaterialMaster } from "@/app/mr-menu/material-master/types";
import { Combobox } from "./_sub-components/combobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export function EditMaterialRequest({
  data,
  materialOption,
  onUpdate,
}: EditMaterialRequestProps) {
  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: {
      materialCode: data.materialCode || "",
      description: data.description || "",
      qtyReq: data.qtyReq || 0,
      uom: data.uom || "",
      purpose: data.purpose || "",
      materialGroup: data.materialGroup || "",
      materialType: data.materialType || "",
    },
    mode: "onBlur",
  });

  // description update when combobox changes
  const handleDescriptionChange = (description: string) => {
    const material = materialOption.find(
      (m) => m.materialDescription === description,
    );

    if (material) {
      form.setValue("description", material.materialDescription || "", {
        shouldValidate: true,
      });
      form.setValue("materialCode", material.materialCode || "");
      form.setValue("uom", material.uom || "");
      form.setValue("materialGroup", material.materialGroup || "");
      form.setValue("materialType", material.materialType || "");
      setNewMaterial(false);
    }
  };

  const handleMaterialFound = (material: MaterialMaster) => {
    form.setValue("materialCode", material.materialCode || "");
    form.setValue("description", material.materialDescription || "");
    form.setValue("uom", material.uom || "");
    form.setValue("materialGroup", material.materialGroup || "");
    form.setValue("materialType", material.materialType || "");
    setNewMaterial(false);
  };

  // reset everything whenever dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        materialCode: data.materialCode || "",
        description: data.description || "",
        qtyReq: data.qtyReq || 0,
        uom: data.uom || "",
        purpose: data.purpose || "",
        materialGroup: data.materialGroup || "",
        materialType: data.materialType || "",
      });

      const isNewMaterial = !materialOption.some(
        (m) => m.materialCode === data.materialCode,
      );
      setNewMaterial(isNewMaterial);
    }
  }, [open, data, form, materialOption]);

  const handleBackToOriginal = () => {
    form.reset({
      materialCode: data.materialCode || "",
      description: data.description || "",
      qtyReq: data.qtyReq || 0,
      uom: data.uom || "",
      purpose: data.purpose || "",
      materialGroup: data.materialGroup || "",
      materialType: data.materialType || "",
    });
  };
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
      materialGroup: formValues.materialGroup || "",
      materialType: formValues.materialType || "",
    };

    onUpdate(data.reqId, data.srNo, updates);
    toast.success("Material request updated successfully");
    setOpen(false);
  };

  const handleDialogClose = () => {
    form.reset();
    setNewMaterial(false);
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

      <DialogContent className="mx-auto lg:w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Material Request</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]  rounded-md px-4">
          {/* Request Info */}
          <div className="space-y-2 py-2 text-sm bg-muted/50 rounded-md mb-6">
            <div className="flex gap-4">
              <div>
                <span className="font-medium text-muted-foreground">
                  Request ID:
                </span>{" "}
                <span className="font-mono">{data.reqId}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  SR No:
                </span>{" "}
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
                        <Input
                          placeholder="Enter material description"
                          {...field}
                        />
                      ) : (
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

              <div className="grid grid-cols-2 gap-4">
                {/* Material Group */}
                <FormField
                  control={form.control}
                  name="materialGroup"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Material Group</FormLabel>
                      <FormControl>
                        {newMaterial ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Material Group" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                  {group}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input {...field} disabled readOnly />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Material Type */}
                <FormField
                  control={form.control}
                  name="materialType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Material Type</FormLabel>
                      <FormControl>
                        {newMaterial ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Material Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input {...field} disabled readOnly />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                      <Input
                        placeholder="Enter purpose of request"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Footer */}
              <DialogFooter className="flex flex-row  gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToOriginal}
                >
                  <ListRestart /> Original
                </Button>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
