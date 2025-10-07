"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MaterialData } from "../types";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<MaterialData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="h-4 w-4"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="h-4 w-4"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("material")}</div>
    ),
  },
  {
    accessorKey: "materialType",
    header: "Material Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("materialType")}
      </span>
    ),
  },
  {
    accessorKey: "materialGroup",
    header: "Material Group",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("materialGroup")}</div>
    ),
  },
  {
    accessorKey: "buom",
    header: "Base Unit of Measure",
    cell: ({ row }) => <div>{row.getValue("buom")}</div>,
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
];
