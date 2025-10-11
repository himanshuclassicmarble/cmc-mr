"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MaterialData } from "../types";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import MREditForm from "./mr-form/mr-edit-form";

export const materialMasterColumns: ColumnDef<MaterialData>[] = [
  {
    accessorKey: "material",
    header: "Material Code ",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("material")}</div>
    ),
  },
  {
    accessorKey: "materialType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("materialType")}
      </span>
    ),
  },
  {
    accessorKey: "materialGroup",
    header: "Group",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("materialGroup")}</div>
    ),
  },
  {
    accessorKey: "uom",
    header: "UOM",
    cell: ({ row }) => <div>{row.getValue("uom")}</div>,
  },
  {
    accessorKey: "materialDescription",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate"
        title={row.getValue("materialDescription")}
      >
        {row.getValue("materialDescription")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="w-20 flex flex-row gap-2">
          <MREditForm />
          <Button
            variant="destructive"
            className="size-8 rounded-full"
            size="sm"
            onClick={() => console.log("Delete:", data.material)}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      );
    },
  },
];
