"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Item = {
  id: number;
  itemId: string;
  itemCode: string;
  itemDetails: string;
  qtyRequired: string;
  uom: string;
  purpose: string;
};

export default function RequestTable() {
  return (
    <div>
      <h2 className="font-semibold m-2 text-xl">Items</h2>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Item ID</TableHead>
              <TableHead className="w-30">Item Code</TableHead>
              <TableHead className="w-90">Item Details</TableHead>
              <TableHead className="w-40">Qty.Required</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead className="w-90">Purpose</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>
                <Input type="number" />
              </TableCell>
              <TableCell>
                <Input type="text" />
              </TableCell>
              <TableCell>
                <Input type="text" />
              </TableCell>
              <TableCell>
                <Input type="number" />
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input type="text" />
              </TableCell>
              <TableCell>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* for mobile and tablet screen */}
      <div className="w-full md:hidden m-2 px-4 py-4 space-y-3 whitespace-nowrap">
        <div className="flex items-center gap-2 ">
          <Label className="w-[120px]">Item ID</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2 ">
          <Label className="w-[120px]">Item Code</Label>
          <Input type="text" />
        </div>
        <div className="flex items-center gap-2 ">
          <Label className="w-[120px]">Item Details</Label>
          <Input type="text" />
        </div>
        <div className="flex items-center gap-2 ">
          <Label className="w-[120px]">Qty.Required</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2  ">
          <Label className="w-[120px]">UOM</Label>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        </div>
        <div className="flex items-center gap-2 ">
          <Label className="w-[120px]">Purpose</Label>
          <Input type="text" />
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button className="">Submit</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
