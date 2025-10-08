import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaterialCodeRequestor } from "./types";

interface MRCodeFormProps {
  data: MaterialCodeRequestor;
}

export default function MRCodeForm({ data }: MRCodeFormProps) {
  const { requesterEmail, plantName, headOfDepartment, storeKeeperName } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <Label>Requester Email</Label>
        <Input value={requesterEmail} type="email" disabled />
      </div>

      <div className="space-y-3">
        <Label>Plant</Label>
        <Input value={plantName} disabled />
      </div>

      <div className="space-y-3">
        <Label>Head of Department</Label>
        <Input value={headOfDepartment} disabled />
      </div>

      <div className="space-y-3">
        <Label>Storekeeper</Label>
        <Input value={storeKeeperName} disabled />
      </div>
    </div>
  );
}
