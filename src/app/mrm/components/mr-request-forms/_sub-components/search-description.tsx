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
  selectedOption: MaterialOption | null;
  setSelectedOption: (value: MaterialOption | null) => void;
}

export function SearchDescription({
  query,
  setQuery,
  filteredOptions,
  selectedOption,
  setSelectedOption,
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
    setQuery(material.materialDescription);
    setSelectedOption(material);
    setOpen(false);
  };

  const handleChange = (value: string) => {
    setQuery(value);

    // If the value doesn't match the selected option, invalidate selection
    if (!selectedOption || selectedOption.materialDescription !== value) {
      setSelectedOption(null);
    }

    if (!open && value.trim()) setOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        value={query}
        placeholder="Search description..."
        onFocus={() => {
          if (query.trim() && filteredOptions.length > 0) {
            setOpen(true);
          }
        }}
        onChange={(e) => handleChange(e.target.value)}
      />

      {open && filteredOptions.length > 0 && (
        <Card className="p-1 absolute z-50 mt-1 w-full border bg-background shadow-lg">
          <ScrollArea className="h-40 rounded-md">
            <div className="divide-y divide-border">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.materialCode}
                  className={cn(
                    "rounded-sm px-4 py-2 cursor-pointer hover:bg-muted transition",
                    selectedOption?.materialCode === opt.materialCode &&
                      "bg-muted/50",
                  )}
                  onClick={() => handleSelect(opt)}
                >
                  <div className="font-medium text-sm">
                    {opt.materialDescription}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Code: {opt.materialCode}
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
