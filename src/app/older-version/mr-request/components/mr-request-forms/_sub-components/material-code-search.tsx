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
  onMaterialFound?: (material: MaterialOption) => void;
  disabled?: boolean; // New prop
}

export const MaterialCodeSearchField = ({
  name,
  materialOptions,
  setNewMaterial,
  onMaterialFound,
  disabled = false, // Default to false
}: MaterialCodeSearchFieldProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useFormContext();

  const handleSearch = () => {
    const code = form.getValues(name);

    if (code === "0") {
      setNewMaterial(true);
      setErrorMessage("");
      form.setValue("description", "");
      form.setValue("uom", "");
      return;
    }

    const foundMaterial = materialOptions.find((m) => m.materialCode === code);

    if (!foundMaterial) {
      setErrorMessage("Material Code does not exist");
      setNewMaterial(false);
      form.setValue("description", "");
      form.setValue("uom", "");
    } else {
      setErrorMessage("");
      setNewMaterial(false);
      form.setValue("description", foundMaterial.materialDescription || "");
      form.setValue("uom", foundMaterial.uom || "");

      if (onMaterialFound) {
        onMaterialFound(foundMaterial);
      }
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
                disabled={disabled}
                className={disabled ? "bg-muted cursor-not-allowed" : ""}
              />
            </FormControl>
            <Button type="button" onClick={handleSearch} disabled={disabled}>
              Search
            </Button>
          </div>
          <FormMessage />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </FormItem>
      )}
    />
  );
};
