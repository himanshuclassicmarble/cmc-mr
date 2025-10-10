"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { MaterialRateItem } from "./types";
import { toast } from "sonner";

interface MRRateTableProps {
  items?: MaterialRateItem[];
}

export default function MRRateTable({ items = [] }: MRRateTableProps) {
  const [editableItems, setEditableItems] = useState(items);

  const handleChange = (
    index: number,
    field: keyof MaterialRateItem,
    value: string | number
  ) => {
    setEditableItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const handleSubmit = () => {
    console.log(editableItems);
    toast("Successfully Requested.");
  };

  return (
    <div>
      <h2 className="font-semibold m-2 text-xl">Items</h2>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Req Id</TableHead>
              <TableHead className="w-20">Sr.No</TableHead>
              <TableHead className="w-30">Item Code</TableHead>
              <TableHead className="w-90">Details</TableHead>
              <TableHead className="w-40">Qty Required</TableHead>
              <TableHead className="w-20">UOM</TableHead>
              <TableHead className="w-90">Purpose</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {editableItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              editableItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input type="text" value={item.requestId ?? ""} readOnly />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.serialNumber ?? 0}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.itemCode ?? ""}
                      onChange={(e) =>
                        handleChange(index, "itemCode", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.details ?? ""}
                      onChange={(e) =>
                        handleChange(index, "details", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantityRequired ?? ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "quantityRequired",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.unitOfMeasurement ?? ""}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.purpose ?? ""}
                      onChange={(e) =>
                        handleChange(index, "purpose", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="outline">
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
