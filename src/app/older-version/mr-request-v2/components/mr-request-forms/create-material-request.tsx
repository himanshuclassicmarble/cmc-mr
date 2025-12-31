"use client";

import { useState } from "react";
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

import { Combobox } from "./_sub-components/combobox";
import { formFieldsSchema, MaterialRateValues, FormFieldsType } from "./schema";
import { DEFAULT_FORM_VALUES, unitOfMeasurement } from "./constants";
import { generateRequestId } from "./utils";
import { MaterialCodeSearchField } from "./_sub-components/material-code-search";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MaterialOption {
  materialCode: string;
  materialType: string;
  materialGroup: string;
  uom: string;
  materialDescription: string;
}

interface MaterialRequestProps {
  materialOption: MaterialOption[];
  onAddData: (newData: MaterialRateValues) => void;
  user: string;
}

export function CreateMaterialRequest({
  materialOption,
  onAddData,
  user,
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

  const handleMaterialFound = (material: MaterialOption) => {
    setSelectedMaterial(material);
  };

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

  const handleDialogClose = () => {
    setNewMaterial(false);
    setSelectedMaterial(null);
    form.reset(DEFAULT_FORM_VALUES);
    setOpen(false);
  };

  const handleSaveAndContinue = async () => {
    const valid = await form.trigger();
    if (!valid) return toast.error("Fix validation errors before saving.");

    const formValues = form.getValues();

    const id = reqId ?? generateRequestId();
    if (!reqId) setReqId(id);

    const newItem: MaterialRateValues = {
      reqId: id,
      srNo: srCounter.toString(),
      materialCode: formValues.materialCode,
      description: formValues.description,
      materialGroup: selectedMaterial?.materialGroup,
      materialType: selectedMaterial?.materialType,
      qtyReq: formValues.qtyReq,
      uom: formValues.uom,
      purpose: formValues.purpose,
      status: "pending",
      createdBy: user,
      createdDate: new Date().toLocaleDateString("en-GB"),
      approvalDate: "",
      qtyApproved: undefined,
      qtyIssued: undefined,
      approvedBy: "",
    };
    onAddData(newItem);
    setSrCounter((prev) => prev + 10);
    form.reset({
      ...DEFAULT_FORM_VALUES,
      materialCode: "",
      description: "",
      purpose: "",
    });
    setSelectedMaterial(null);
    setNewMaterial(false);
    toast.success(`${id}:${srCounter}| New MR Added.`);
  };

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) return toast.error("Fix validation errors before saving.");

    const id = reqId ?? generateRequestId();

    const formValues = form.getValues();

    const newItem: MaterialRateValues = {
      reqId: id,
      srNo: srCounter.toString(),
      materialCode: formValues.materialCode,
      description: formValues.description,
      materialGroup: selectedMaterial?.materialGroup,
      materialType: selectedMaterial?.materialType,
      qtyReq: formValues.qtyReq,
      uom: formValues.uom,
      purpose: formValues.purpose,
      status: "pending",
      createdBy: user,
      createdDate: new Date().toLocaleDateString("en-GB"),
      approvalDate: "",
      qtyApproved: undefined,
      qtyIssued: undefined,
      approvedBy: "",
    };

    onAddData(newItem);

    setReqId(null);
    setSrCounter(10);

    form.reset(DEFAULT_FORM_VALUES);
    setSelectedMaterial(null);
    setNewMaterial(false);
    setOpen(false);

    toast.success("Material Request Saved");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Material Request</Button>
      </DialogTrigger>

      <DialogContent className="mx-auto px-2 py-4">
        <DialogHeader>
          <DialogTitle>Create Material Request</DialogTitle>
        </DialogHeader>
        <ScrollArea className=" rounded-none px-4">
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
                        <Combobox
                          options={materialOption.map((m) => ({
                            value: m.materialDescription,
                            label: m.materialDescription,
                          }))}
                          value={field.value}
                          onValueChange={handleDescriptionChange}
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
