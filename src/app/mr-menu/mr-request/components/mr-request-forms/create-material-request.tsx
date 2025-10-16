"use client";

import { useState } from "react";
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
import { Card } from "@/components/ui/card";
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
import { Plus, Pencil, X } from "lucide-react";

import { Combobox } from "./_sub-components/combobox";
import { formFieldsSchema, MaterialRateValues } from "./schema";
import { DEFAULT_FORM_VALUES, unitOfMeasurement } from "./constants";
import { FormFields } from "./types";
import { generateRequestId, renumberItems } from "./utils";

// Update MaterialOption type to include all fields
interface MaterialOption {
  materialCode: string;
  materialType: string;
  materialGroup: string;
  uom: string;
  materialDescription: string;
}

// Update MaterialRequestProps type
interface MaterialRequestProps {
  materialOption: MaterialOption[];
  onAddData: (newData: MaterialRateValues) => void;
}

export function CreateMaterialRequest({
  materialOption,
  onAddData,
}: MaterialRequestProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MaterialRateValues[]>([]);

  const form = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  // ==================== Material Selection Handlers ====================

  const handleMaterialCodeChange = (code: string) => {
    const selectedMaterial = materialOption.find(
      (m) => m.materialCode === code,
    );

    if (selectedMaterial) {
      form.setValue("materialCode", code, { shouldValidate: true });
      form.setValue("description", selectedMaterial.materialDescription || "");
      form.setValue("uom", selectedMaterial.uom || "");
      // Optionally set materialType and materialGroup in the form if they are part of FormFields
      // form.setValue("materialType", selectedMaterial.materialType || "");
      // form.setValue("materialGroup", selectedMaterial.materialGroup || "");
    }
  };

  const handleDescriptionChange = (description: string) => {
    const selectedMaterial = materialOption.find(
      (m) => m.materialDescription === description,
    );

    if (selectedMaterial) {
      form.setValue("description", description, { shouldValidate: true });
      form.setValue("materialCode", selectedMaterial.materialCode || "");
      form.setValue("uom", selectedMaterial.uom || "");
      // Optionally set materialType and materialGroup in the form if they are part of FormFields
      // form.setValue("materialType", selectedMaterial.materialType || "");
      // form.setValue("materialGroup", selectedMaterial.materialGroup || "");
    }
  };

  // ==================== Item Management ====================

  const handleAddItem = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please fix validation errors before adding.");
      return;
    }

    const formValues = form.getValues();
    const selectedMaterial = materialOption.find(
      (m) => m.materialCode === formValues.materialCode,
    );

    const newItem: MaterialRateValues = {
      reqId: generateRequestId(),
      srNo: String(items.length * 10 + 10),
      materialCode: formValues.materialCode,
      description: formValues.description,
      materialGroup: selectedMaterial?.materialGroup || "",
      materialType: selectedMaterial?.materialType || "",
      qtyReq: formValues.qtyReq,
      qtyApproved: "",
      qtyIssued: "",
      uom: formValues.uom,
      purpose: formValues.purpose,
      status: "pending",
      createdDate: new Date().toLocaleDateString(),
      approvalDate: "",
      createdBy: "",
      approvedBy: "",
    };

    setItems((prev) => [...prev, newItem]);
    toast.success("Item added successfully");
    form.reset(DEFAULT_FORM_VALUES);
  };

  const handleEditItem = (index: number) => {
    const itemToEdit = items[index];
    const remainingItems = items.filter((_, i) => i !== index);

    setItems(renumberItems(remainingItems));

    form.reset({
      materialCode: itemToEdit.materialCode,
      description: itemToEdit.description,
      qtyReq: itemToEdit.qtyReq,
      uom: itemToEdit.uom,
      purpose: itemToEdit.purpose,
      // Optionally include materialType and materialGroup if they are part of FormFields
      // materialType: itemToEdit.materialType,
      // materialGroup: itemToEdit.materialGroup,
    });
  };

  const handleRemoveItem = (index: number) => {
    const remainingItems = items.filter((_, i) => i !== index);
    setItems(renumberItems(remainingItems));
    toast.message("Item removed");
  };

  const handleDialogClose = () => {
    setItems([]);
    form.reset(DEFAULT_FORM_VALUES);
    setOpen(false);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("Add at least one item before saving.");
      return;
    }

    items.forEach((item) => onAddData(item));

    toast.success(`${items.length} request(s) added to table!`);
    handleDialogClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Material Request</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Material Request</DialogTitle>
        </DialogHeader>

        {/* Items Preview */}
        <ScrollArea className="h-[200px]">
          <Card className="p-2 pr-3 shadow-none">
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <Card
                    key={`${item.reqId}-${index}`}
                    className="p-3 shadow-none border bg-muted/20"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">
                        SR No: <span className="font-mono">{item.srNo}</span>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditItem(index)}
                          aria-label="Edit item"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveItem(index)}
                          aria-label="Remove item"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-xs space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">{item.materialCode}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{item.materialType}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">Group:</span>
                        <span className="font-medium">
                          {item.materialGroup}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">Qty:</span>
                        <span className="font-medium">
                          {item.qtyReq} {item.uom}
                        </span>
                      </div>

                      {item.description && (
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground shrink-0">
                            Description:
                          </span>
                          <span className="font-medium">
                            {item.description}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground shrink-0">
                          Purpose:
                        </span>
                        <span className="font-medium">{item.purpose}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <h3 className="font-semibold text-sm">No Items Added</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Fill the form below to add items
                </p>
              </div>
            )}
          </Card>
        </ScrollArea>

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
                      options={materialOption.map((m) => ({
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
                      options={materialOption.map((m) => ({
                        value: m.materialDescription,
                        label: m.materialDescription,
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
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter purpose of request"
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={handleAddItem}
                        aria-label="Add item"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSave}
                disabled={items.length === 0}
              >
                Save {items.length > 0 && `(${items.length})`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
