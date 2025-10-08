import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RequestForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <Label>Requestor Email </Label>
        <Input type="email" placeholder="abc@classicmarble.com" disabled />
      </div>

      <div className="space-y-3">
        <Label>Plant </Label>
        <Input placeholder="1100" disabled />
      </div>

      <div className="space-y-3">
        <Label>HOD</Label>
        <Input type="email" placeholder="abc@classicmarble.com" disabled />
      </div>

      <div className="space-y-3">
        <Label>Storekeeper </Label>
        <div className="flex flex-row  gap-2">
          <Input placeholder="abc@classicmarble.com" disabled />
        </div>
      </div>
    </div>
  );
}
