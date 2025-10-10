"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { MaterialData } from "../types";
import { EditMaterialRequest } from "./mr-request-forms/edit-material-request";

export const MRHomeColumn: ColumnDef<MaterialData>[] = [
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusColor =
        status === "approved"
          ? "bg-green-600 text-green-50"
          : status === "pending"
            ? "bg-red-600 text-red-50"
            : "";

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${statusColor}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-2">
          <EditMaterialRequest />
          <Button
            variant="destructive"
            className="rounded-full"
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
