"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { MaterialOption } from "../types";

interface SearchDescriptionProps {
  query: string;
  setQuery: (value: string) => void;
  filteredOptions: MaterialOption[];
  value?: string;
  onValueChange: (selectedDescription: string) => void;
}

export function SearchDescription({
  query,
  setQuery,
  filteredOptions,
  value = "",
  onValueChange,
}: SearchDescriptionProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (material: MaterialOption) => {
    onValueChange(material.materialDescription);
    setQuery(material.materialDescription);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        value={value ?? ""}
        placeholder="Search description..."
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuery(newValue);
          onValueChange(newValue);
          if (!open) setOpen(true);
        }}
      />

      {open && filteredOptions.length > 0 && (
        <Card className="p-1 absolute z-50 mt-1 w-full border bg-background">
          <ScrollArea className="h-40 rounded-md">
            <div className="divide-y divide-border">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.materialCode}
                  className={cn(
                    "rounded-sm px-4 py-2 cursor-pointer hover:bg-muted transition",
                    value === opt.materialDescription && "bg-muted/50",
                  )}
                  onClick={() => handleSelect(opt)}
                >
                  <div className="font-medium text-sm">
                    {opt.materialDescription}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
