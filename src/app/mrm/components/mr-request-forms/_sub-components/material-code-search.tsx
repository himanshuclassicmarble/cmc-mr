"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface MaterialOption {
  materialCode: string;
  materialType: string;
  materialGroup: string;
  uom: string;
  materialDescription: string;
}

interface MaterialCodeSearchFieldProps {
  name: string;
  materialOptions: MaterialOption[];
  setNewMaterial: (value: boolean) => void;
  onMaterialFound?: (material: MaterialOption | null) => void;
  disabled?: boolean;
}

export const MaterialCodeSearchField = ({
  name,
  materialOptions,
  setNewMaterial,
  onMaterialFound,
  disabled = false,
}: MaterialCodeSearchFieldProps) => {
  const form = useFormContext();

  const handleSearch = () => {
    const code = form.getValues(name);

    // Clear previous errors
    form.clearErrors(name);

    if (!code || code.trim() === "") {
      form.setError(name, {
        type: "manual",
        message: "Material code is required",
      });
      return;
    }

    if (code === "0") {
      setNewMaterial(true);
      form.setValue("description", "");
      form.setValue("uom", "");
      onMaterialFound?.(null);
      return;
    }

    const foundMaterial = materialOptions.find((m) => m.materialCode === code);

    if (!foundMaterial) {
      form.setError(name, {
        type: "manual",
        message: "Material code does not exist",
      });
      setNewMaterial(false);
      form.setValue("description", "");
      form.setValue("uom", "");
      onMaterialFound?.(null);
    } else {
      setNewMaterial(false);
      form.setValue("description", foundMaterial.materialDescription || "", {
        shouldValidate: true,
      });
      form.setValue("uom", foundMaterial.uom || "");
      onMaterialFound?.(foundMaterial);
    }
  };

  const handleInputChange = (value: string) => {
    form.setValue(name, value);
    // Clear any existing material selection when code is manually edited
    if (onMaterialFound) {
      onMaterialFound(null);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Material Code</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input
                placeholder="Enter Material Code (0 for new)"
                {...field}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={disabled}
                className={disabled ? "bg-muted cursor-not-allowed" : ""}
              />
            </FormControl>
            <Button type="button" onClick={handleSearch} disabled={disabled}>
              Search
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
