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
import { formFieldsSchema, MaterialRateValues, FormFieldsType } from "./schema";
import { DEFAULT_FORM_VALUES, unitOfMeasurement } from "./constants";
import { generateRequestId, renumberItems } from "./utils";
import { MaterialCodeSearchField } from "./_sub-components/material-code-search";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
}

export function CreateMaterialRequest({
  materialOption,
  onAddData,
}: MaterialRequestProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MaterialRateValues[]>([]);
  const [currentReqId, setCurrentReqId] = useState<string>("");
  const [newMaterial, setNewMaterial] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialOption | null>(null);

  const form = useForm<FormFieldsType>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  // ==================== Material Selection Handlers ====================

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

  // ==================== Item Management ====================

  const handleAddItem = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please fix validation errors before adding.");
      return;
    }

    const formValues = form.getValues();

    // Generate reqId only once for the first item
    const reqId = currentReqId || generateRequestId();
    if (!currentReqId) {
      setCurrentReqId(reqId);
    }

    const newItem: MaterialRateValues = {
      reqId: reqId,
      srNo: String(items.length * 10 + 10),
      materialCode: formValues.materialCode,
      description: formValues.description,
      materialGroup: newMaterial ? undefined : selectedMaterial?.materialGroup,
      materialType: newMaterial ? undefined : selectedMaterial?.materialType,
      qtyReq: formValues.qtyReq,
      qtyApproved: undefined,
      qtyIssued: undefined,
      uom: formValues.uom,
      purpose: formValues.purpose,
      status: "pending",
      createdDate: new Date().toLocaleDateString("en-GB"),
      approvalDate: "",
      createdBy: "Himanshu Vishwakarma",
      approvedBy: "",
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(
      newMaterial ? "New material item added" : "Item added successfully",
    );
    form.reset(DEFAULT_FORM_VALUES);
    setNewMaterial(false);
    setSelectedMaterial(null);
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
    });

    if (itemToEdit.materialCode === "0") {
      setNewMaterial(true);
    } else {
      const material = materialOption.find(
        (m) => m.materialCode === itemToEdit.materialCode,
      );
      if (material) {
        setSelectedMaterial(material);
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    const remainingItems = items.filter((_, i) => i !== index);
    setItems(renumberItems(remainingItems));
    toast.message("Item removed");
  };

  const handleDialogClose = () => {
    setItems([]);
    setCurrentReqId("");
    setNewMaterial(false);
    setSelectedMaterial(null);
    form.reset(DEFAULT_FORM_VALUES);
    setOpen(false);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("Add at least one item before saving.", {
        position: "top-center",
      });
      return;
    }

    items.forEach((item) => onAddData(item));

    toast.success(`${items.length} request(s) added successfully!`, {
      description: `ReqID: ${currentReqId}`,
      position: "top-center",
      duration: 6000,
      action: {
        label: "OK",
        onClick: () => toast.dismiss(),
      },
    });

    handleDialogClose();
  };
  const handleCancel = () => {
    setItems([]);

    setCurrentReqId("");

    setNewMaterial(false);
    setSelectedMaterial(null);

    form.reset(DEFAULT_FORM_VALUES);

    setOpen(false);

    toast.message("Form has been cleared");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create Material Request</Button>
      </DrawerTrigger>

      <DrawerContent className="justify-self-center lg:w-4xl">
        <DrawerHeader>
          <DrawerTitle>Create Material Request</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[60vh] rounded-md px-4 pb-6">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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

              <Button
                type="button"
                onClick={handleAddItem}
                aria-label="Add item"
                variant="destructive"
                className="flex justify-self-end"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </form>
          </Form>
          <Separator orientation="horizontal" className="m-2" />
          <ScrollArea className="h-[200px] bg-card rounded-md ">
            <div className="p-2 shadow-none border-0">
              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <Card
                      key={`${item.reqId}-${index}`}
                      className="p-2 gap-2 shadow-sm border bg-card hover:bg-accent/30 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                          SR No:{" "}
                          <span className="font-mono text-sm text-foreground">
                            {item.srNo}
                          </span>
                        </span>
                        <div className="flex gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditItem(index)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">
                            Material:
                          </span>
                          <span className="font-medium">
                            {item.materialCode}
                          </span>
                        </div>

                        {item.materialType && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">
                              {item.materialType}
                            </span>
                          </div>
                        )}

                        {item.materialGroup && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                              Group:
                            </span>
                            <span className="font-medium">
                              {item.materialGroup}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Qty:</span>
                          <span className="font-medium">
                            {item.qtyReq} {item.uom}
                          </span>
                        </div>

                        {item.description && (
                          <div className="col-span-2 flex gap-1">
                            <span className="text-muted-foreground">
                              Description:
                            </span>
                            <span className="font-medium break-words">
                              {item.description}
                            </span>
                          </div>
                        )}

                        <div className="col-span-2 flex gap-1">
                          <span className="text-muted-foreground">
                            Purpose:
                          </span>
                          <span className="font-medium break-words">
                            {item.purpose}
                          </span>
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
            </div>
          </ScrollArea>

          <DrawerFooter className="flex flex-row justify-end gap-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              onClick={handleSave}
              disabled={items.length === 0}
            >
              Save
              <Badge variant="destructive" className="rounded-full size-6 p-1">
                {items.length > 0 && `(${items.length})`}
              </Badge>
            </Button>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
