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

import { MaterialMaster } from "@/app/material-master/types";
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

      setNewMaterial(
        !materialOption.some((m) => m.materialCode === data.materialCode),
      );
    }
  }, [open, data, form, materialOption]);

  const handleDescriptionChange = (desc: string) => {
    const material = materialOption.find((m) => m.materialDescription === desc);

    if (material) {
      form.setValue("description", material.materialDescription);
      form.setValue("materialCode", material.materialCode);
      form.setValue("uom", material.uom);
      form.setValue("materialGroup", material.materialGroup);
      form.setValue("materialType", material.materialType);
      setNewMaterial(false);
    }
  };

  const handleMaterialFound = (material: MaterialMaster) => {
    form.reset({
      materialCode: material.materialCode,
      description: material.materialDescription,
      qtyReq: form.getValues("qtyReq") ?? 0,
      uom: material.uom,
      materialGroup: material.materialGroup,
      materialType: material.materialType,
      purpose: form.getValues("purpose") ?? "",
    });
    setNewMaterial(false);
  };

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) return toast.error("Please fix validation errors.");

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
      return toast.error(res.error);
    }

    toast.success("Material request updated successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Material Request</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] px-2">
          <Form key={open ? "form-open" : "form-closed"} {...form}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <MaterialCodeSearchField
                name="materialCode"
                materialOptions={materialOption}
                setNewMaterial={setNewMaterial}
                onMaterialFound={handleMaterialFound}
              />

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
                          query={query}
                          setQuery={setQuery}
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleDescriptionChange(val);
                          }}
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
                          <Input {...field} readOnly disabled />
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
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <FormControl>
                        {newMaterial ? (
                          <div>
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
                            <input
                              type="hidden"
                              name="materialType"
                              value={field.value ?? ""}
                            />
                          </div>
                        ) : (
                          <Input {...field} readOnly disabled />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Qty + UOM */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="qtyReq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Required</FormLabel>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                          <Input {...field} readOnly disabled />
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
                    <Input placeholder="Enter purpose" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
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
