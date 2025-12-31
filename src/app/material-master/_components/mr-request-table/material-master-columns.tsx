"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { MRMasterSchema } from "../mr-master-form/schema";
import MREditForm from "../mr-master-form/mr-edit/mr-edit-form";

export const getMaterialMasterColumns = (): ColumnDef<MRMasterSchema>[] => [
  {
    accessorKey: "materialCode",
    header: "Material Code ",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("materialCode")}</div>
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
    cell: ({ row }) => (
      <div className="flex gap-2">
        <MREditForm rowData={row.original} rowIndex={row.index} />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => console.log("Delete:", row.original.materialCode)}
        >
          <Trash />
        </Button>
      </div>
    ),
  },
];
