"use client";

import { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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

import { formFieldsSchema, FormFieldsType } from "../schema";
import { DEFAULT_FORM_VALUES, unitOfMeasurement } from "../constants";
import { MaterialCodeSearchField } from "../_sub-components/material-code-search";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchDescription } from "../_sub-components/search-description";
import { useDebounce } from "@/hooks/useDebouncer";
import { saveMaterialRequestAction } from "./action";
import { MaterialOption } from "../types";
import { createReqId } from "./get-req-id-action";

interface MaterialRequestProps {
  materialOption: MaterialOption[];
}

export function CreateMaterialRequest({
  materialOption,
}: MaterialRequestProps) {
  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialOption | null>(null);
  const [reqId, setReqId] = useState<string | null>(null);
  const [srCounter, setSrCounter] = useState<number>(10);

  const form = useForm<FormFieldsType>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  const [query, setQuery] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<MaterialOption[]>([]);
  const debounced = useDebounce(query, 1000);

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

  const handleMaterialFound = (material: MaterialOption | null) => {
    setSelectedMaterial(material);
  };

  const handleDialogClose = () => {
    setNewMaterial(false);
    setSelectedMaterial(null);
    setQuery("");
    form.reset(DEFAULT_FORM_VALUES);
    setOpen(false);
  };

  const validateMaterialMatch = (): boolean => {
    const values = form.getValues();

    // For new materials (materialCode = "0"), allow save
    if (newMaterial && values.materialCode === "0") {
      return true;
    }

    // For existing materials, ensure they match
    if (!selectedMaterial) {
      toast.error("Please select a valid material from the list");
      return false;
    }

    // Verify material code and description match the selected material
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

  const handleSaveAndContinue = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix validation errors");
      return;
    }

    if (!validateMaterialMatch()) {
      return;
    }

    const values = form.getValues();

    let currentReqId = reqId;
    if (!currentReqId) {
      currentReqId = await createReqId();
      setReqId(currentReqId);
    }

    const formData = new FormData();
    formData.append("mode", "continue");
    formData.append("reqId", currentReqId);
    formData.append("srNo", srCounter.toString());
    formData.append("materialCode", values.materialCode);
    formData.append("description", values.description);

    if (selectedMaterial?.materialGroup) {
      formData.append("materialGroup", selectedMaterial.materialGroup);
    }

    if (selectedMaterial?.materialType) {
      formData.append("materialType", selectedMaterial.materialType);
    }

    formData.append("qtyReq", values.qtyReq.toString());
    formData.append("uom", values.uom);
    formData.append("purpose", values.purpose);

    const res = await saveMaterialRequestAction(null, formData);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    setSrCounter((p) => p + 10);
    setNewMaterial(false);
    setSelectedMaterial(null);
    setQuery("");
    form.reset(DEFAULT_FORM_VALUES);

    toast.success(`Saved | Req ${currentReqId}`);
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

    let currentReqId = reqId;
    if (!currentReqId) {
      currentReqId = await createReqId();
    }

    const formData = new FormData();
    formData.append("mode", "final");
    formData.append("reqId", currentReqId);
    formData.append("srNo", srCounter.toString());
    formData.append("materialCode", values.materialCode);
    formData.append("description", values.description);

    if (selectedMaterial?.materialGroup) {
      formData.append("materialGroup", selectedMaterial.materialGroup);
    }

    if (selectedMaterial?.materialType) {
      formData.append("materialType", selectedMaterial.materialType);
    }

    formData.append("qtyReq", values.qtyReq.toString());
    formData.append("uom", values.uom);
    formData.append("purpose", values.purpose);

    const res = await saveMaterialRequestAction(null, formData);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    setReqId(null);
    setSrCounter(10);
    setNewMaterial(false);
    setSelectedMaterial(null);
    setQuery("");
    form.reset(DEFAULT_FORM_VALUES);
    setOpen(false);

    toast.success("Material Request Submitted");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Material Request</Button>
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
          <DialogTitle>Create Material Request</DialogTitle>
        </DialogHeader>
        <ScrollArea className="rounded-none px-4">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <MaterialCodeSearchField
                name="materialCode"
                materialOptions={materialOption}
                setNewMaterial={setNewMaterial}
                onMaterialFound={handleMaterialFound}
                disabled={selectedMaterial !== null && !newMaterial}
              />

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
                        <SearchDescription
                          query={field.value || query}
                          setQuery={(val) => {
                            setQuery(val);
                            form.setValue("description", val, {
                              shouldValidate: true,
                            });
                          }}
                          filteredOptions={filteredOptions}
                          selectedOption={selectedMaterial}
                          setSelectedOption={(material) => {
                            setSelectedMaterial(material);

                            if (material) {
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
                            } else {
                              // Manual edit → invalidate material code and uom
                              form.setValue("materialCode", "");
                              form.setValue("uom", "");
                            }
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          placeholder="0"
                          min="0"
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
            </form>
          </Form>

          <DialogFooter className="mt-2 flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleSaveAndContinue}>
              Save & Continue
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
