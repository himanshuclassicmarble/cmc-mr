"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MaterialData } from "../types";

export const columns: ColumnDef<MaterialData>[] = [
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
    accessorKey: "buom",
    header: "BUOM",
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
