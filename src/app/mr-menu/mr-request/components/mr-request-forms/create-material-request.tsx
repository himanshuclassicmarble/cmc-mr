"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  materialRateSchema,
  unitOfMeasurement,
  type MaterialRateFormValues,
} from "./schema";
import { Plus, Pencil, X, PlusCircle } from "lucide-react";
import { Combobox } from "./combobox";
import { CreateMaterialRequestProps } from "../mr-request-table/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateMaterialRequest({
  materialOption,
}: CreateMaterialRequestProps) {
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<MaterialRateFormValues[]>([]);

  const handleItemCodeChange = (code: string) => {
    const selected = materialOption.find((m) => m.materialCode === code);
    form.setValue("materialCode", code);
    form.setValue("description", selected?.description || "");
  };

  const handleDescriptionChange = (desc: string) => {
    const selected = materialOption.find((m) => m.description === desc);
    form.setValue("description", desc);
    form.setValue("materialCode", selected?.materialCode || "");
  };
  const form = useForm<MaterialRateFormValues>({
    resolver: zodResolver(materialRateSchema),
    defaultValues: {
      requestId: "",
      serialNumber: undefined,
      materialCode: "",
      description: "",
      quantityRequired: 0,
      unitOfMeasurement: undefined,
      purpose: "",
    },
    mode: "onBlur",
  });

  const handleAddItem = async () => {
    const valid = await form.trigger([
      "materialCode",
      "description",
      "quantityRequired",
      "unitOfMeasurement",
      "purpose",
    ]);
    if (!valid) {
      toast.error("Please fix the errors before adding.");
      return;
    }
    const v = form.getValues();
    const nextSerial = items.length + 1;
    const newItem: MaterialRateFormValues = {
      ...v,
      serialNumber: nextSerial,
    };
    setItems((prev) => [...prev, newItem]);

    toast.success("Item added");
    // reset row fields for next entry
    form.reset({
      requestId: "",
      serialNumber: undefined,
      materialCode: "",
      description: "",
      quantityRequired: 0,
      unitOfMeasurement: undefined,
      purpose: "",
    });
  };

  const handleEditItem = (index: number) => {
    const target = items[index];
    // remove from list and renumber remaining
    const remaining = items
      .filter((_, i) => i !== index)
      .map((it, i) => ({
        ...it,
        serialNumber: i + 1,
      }));
    setItems(remaining);

    // "empty the form and revert the data of that card" => put card data back into the form
    form.reset({
      requestId: "",
      serialNumber: undefined,
      materialCode: target.materialCode ?? "",
      description: target.description ?? "",
      quantityRequired: target.quantityRequired ?? 0,
      unitOfMeasurement: target.unitOfMeasurement ?? "",
      purpose: target.purpose ?? "",
    });
  };

  const handleRemoveItem = (index: number) => {
    const remaining = items
      .filter((_, i) => i !== index)
      .map((it, i) => ({
        ...it,
        serialNumber: i + 1,
      }));
    setItems(remaining);
    toast.message("Item removed");
  };

  const generateRequestId = () => {
    const ts = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);
    return `REQ-${ts}`;
  };

  const handleSave = async () => {
    // You may optionally auto-add the currently filled row if valid and not empty.
    // For clarity, we only save what has been explicitly added via the + button.
    if (items.length === 0) {
      toast.error("Add at least one item before saving.");
      return;
    }
    const requestId = generateRequestId();
    const payload = {
      requestId,
      items,
    };
    // eslint-disable-next-line no-console
    console.log("Material Request Payload:", payload);
    toast.success(`Request ${requestId} created!`);

    // reset everything after save
    setItems([]);
    form.reset({
      requestId: "",
      serialNumber: undefined,
      materialCode: "",
      description: "",
      quantityRequired: 0,
      unitOfMeasurement: undefined,
      purpose: "",
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          // reset on close
          setItems([]);
          form.reset({
            requestId: "",
            serialNumber: undefined,
            materialCode: "",
            description: "",
            quantityRequired: 0,
            unitOfMeasurement: undefined,
            purpose: "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Create Material Request</Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Create Material Request</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[200px] overflow-hidden">
          <Card className="p-2 pr-3 shadow-none">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {items.map((it, idx) => (
                  <Card
                    key={idx}
                    className="p-2 shadow-none border rounded-md bg-muted/20"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold tracking-tight">
                          SR No:{" "}
                          <span className="font-mono">{it.serialNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border"
                            onClick={() => handleEditItem(idx)}
                            aria-label="Edit item"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemoveItem(idx)}
                            aria-label="Remove item"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="text-xs space-y-1">
                        {/* Material & Qty */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-muted-foreground">
                            Material:
                          </span>
                          <span className="font-medium">{it.materialCode}</span>

                          <span className="text-muted-foreground">•</span>

                          <span className="text-muted-foreground">Qty:</span>
                          <span className="font-medium">
                            {it.quantityRequired} {it.unitOfMeasurement || ""}
                          </span>
                        </div>

                        {/* Description (Conditional) */}
                        {it.description && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground">
                              Description:
                            </span>
                            <span className="font-medium">
                              {it.description}
                            </span>
                          </div>
                        )}

                        {/* Purpose */}
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Purpose:
                          </span>
                          <span className="font-medium">{it.purpose}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-12">
                <h2 className="font-semibold text-sm">Add Items</h2>
                <div className="hidden md:table-cell text-xs text-muted-foreground">
                  Fill below details to create request
                </div>
                <PlusCircle size={28} className="mt-2" />
              </div>
            )}
          </Card>
        </ScrollArea>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <div className="gap-2">
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
                        onValueChange={(value) => handleItemCodeChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Combobox
                        options={materialOption.map((m) => ({
                          value: m.description,
                          label: m.description,
                        }))}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value); // ✅ Update RHF form state
                          handleDescriptionChange(value); // ✅ Sync Material Code too
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-2 w-full">
              {/* Quantity Required */}
              <FormField
                control={form.control}
                name="quantityRequired"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quantity Required</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={
                          Number.isFinite(field.value as number)
                            ? String(field.value)
                            : ""
                        }
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          field.onChange(Number.isNaN(num) ? 0 : num);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              {/* Unit of Measurement */}
              <FormField
                control={form.control}
                name="unitOfMeasurement"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Unit of Measurement</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select UOM" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOfMeasurement.map((uom, idx) => (
                            <SelectItem key={idx} value={uom}>
                              {uom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row justify-between items-end gap-2">
              {/* Purpose + Add (+) */}
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <Input placeholder="Enter Purpose" {...field} />
                        <Button
                          type="button"
                          onClick={handleAddItem}
                          aria-label="Add item"
                        >
                          <Plus className="" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleSave} className="md:w-40">
                Save
              </Button>
              <DialogClose asChild>
                <Button className="md:w-40 bg-transparent" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
