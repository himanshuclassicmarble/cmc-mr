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
import { Pencil } from "lucide-react";

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
import { useDebounce } from "@/hooks/useDebouncer";
import { MaterialCodeSearchField } from "../_sub-components/material-code-search";
import { EditMaterialRequestProps, FormFields, MaterialOption } from "../types";
import { formFieldsSchema } from "../schema";
import { SearchDescription } from "../_sub-components/search-description";
import { materialGroups, materialTypes, unitOfMeasurement } from "../constants";
import { updateMaterialRequestAction } from "./action";

export function EditMaterialRequest({
  data,
  materialOption,
}: EditMaterialRequestProps) {
  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialOption | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: {
      materialCode: "",
      description: "",
      qtyReq: 0,
      uom: "",
      purpose: "",
      materialGroup: "",
      materialType: "",
    },
    mode: "onBlur",
  });

  const debounced = useDebounce(query, 400);
  const [filteredOptions, setFilteredOptions] = useState<MaterialOption[]>([]);

  useEffect(() => {
    if (!debounced.trim()) {
      setFilteredOptions([]);
      return;
    }

    const result = materialOption
      .filter((opt) =>
        opt.materialDescription.toLowerCase().includes(debounced.toLowerCase()),
      )
      .slice(0, 10);

    setFilteredOptions(result);
  }, [debounced, materialOption]);

  useEffect(() => {
    if (open && data) {
      form.reset({
        materialCode: data.materialCode ?? "",
        description: data.description ?? "",
        qtyReq: data.qtyReq ?? 0,
        uom: data.uom ?? "",
        purpose: data.purpose ?? "",
        materialGroup: data.materialGroup ?? "",
        materialType: data.materialType ?? "",
      });

      const existingMaterial = materialOption.find(
        (m) => m.materialCode === data.materialCode,
      );

      if (existingMaterial) {
        setSelectedMaterial(existingMaterial);
        setQuery(existingMaterial.materialDescription);
        setNewMaterial(false);
      } else {
        setSelectedMaterial(null);
        setNewMaterial(true);
      }
    }
  }, [open, data, form, materialOption]);

  const handleMaterialFound = (material: MaterialOption | null) => {
    setSelectedMaterial(material);

    if (material) {
      form.setValue("description", material.materialDescription, {
        shouldValidate: true,
      });
      form.setValue("uom", material.uom);
      form.setValue("materialGroup", material.materialGroup);
      form.setValue("materialType", material.materialType);
      setNewMaterial(false);
    }
  };

  const validateMaterialMatch = (): boolean => {
    const values = form.getValues();

    if (newMaterial && values.materialCode === "0") {
      if (!values.materialGroup || !values.materialType) {
        toast.error("Please select material group and type for new materials");
        return false;
      }
      return true;
    }

    if (!selectedMaterial) {
      toast.error("Please select a valid material from the list");
      return false;
    }

    if (
      values.materialCode !== selectedMaterial.materialCode ||
      values.description !== selectedMaterial.materialDescription
    ) {
      toast.error(
        "Material code and description do not match. Please search again.",
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix validation errors");
      return;
    }

    if (!validateMaterialMatch()) {
      return;
    }

    const values = form.getValues();

    const formData = new FormData();
    formData.append("reqId", data.reqId);
    formData.append("srNo", data.srNo.toString());
    formData.append("materialCode", values.materialCode);
    formData.append("description", values.description);
    formData.append("materialGroup", values.materialGroup || "");
    formData.append("materialType", values.materialType || "");
    formData.append("qtyReq", values.qtyReq.toString());
    formData.append("uom", values.uom);
    formData.append("purpose", values.purpose);

    const res = await updateMaterialRequestAction(null, formData);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Material request updated successfully");
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setNewMaterial(false);
    setSelectedMaterial(null);
    setQuery("");
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-full max-w-md
          mx-auto

          bottom-0 sm:top-1/2
          sm:-translate-y-1/2

          max-h-[90dvh]
          overflow-y-auto

          px-3 py-4
        "
      >
        <DialogHeader>
          <DialogTitle>Edit Material Request</DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-2">
          <Form {...form}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                        <Input placeholder="Enter description" {...field} />
                      ) : (
                        <SearchDescription
                          filteredOptions={filteredOptions}
                          query={field.value || query}
                          setQuery={(val) => {
                            setQuery(val);
                            form.setValue("description", val, {
                              shouldValidate: true,
                            });
                          }}
                          selectedOption={selectedMaterial}
                          setSelectedOption={(material) => {
                            setSelectedMaterial(material);

                            if (material) {
                              // Autofill all fields
                              form.setValue(
                                "description",
                                material.materialDescription,
                                { shouldValidate: true },
                              );
                              form.setValue(
                                "materialCode",
                                material.materialCode || "",
                              );
                              form.setValue("uom", material.uom || "");
                              form.setValue(
                                "materialGroup",
                                material.materialGroup || "",
                              );
                              form.setValue(
                                "materialType",
                                material.materialType || "",
                              );
                            } else {
                              // Manual edit → invalidate all dependent fields
                              form.setValue("materialCode", "");
                              form.setValue("uom", "");
                              form.setValue("materialGroup", "");
                              form.setValue("materialType", "");
                            }
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Material Group & Type */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="materialGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Group</FormLabel>
                      <FormControl>
                        {newMaterial ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialGroups.map((g) => (
                                <SelectItem key={g} value={g}>
                                  {g}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...field}
                            disabled
                            className="bg-muted cursor-not-allowed"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materialType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <FormControl>
                        {newMaterial ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialTypes.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...field}
                            disabled
                            className="bg-muted cursor-not-allowed"
                          />
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
                          min={0}
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
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
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        {newMaterial ? (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select UOM" />
                            </SelectTrigger>
                            <SelectContent>
                              {unitOfMeasurement.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...field}
                            disabled
                            className="bg-muted cursor-not-allowed"
                          />
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
                      <Input placeholder="Enter purpose" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="pt-4 flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
          </DialogClose>

          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
