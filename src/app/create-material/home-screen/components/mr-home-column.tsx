"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { MaterialData } from "../types";
import { EditMaterialRequest } from "./mr-request-forms/edit-material-request";

export const MRHomeColumn: ColumnDef<MaterialData>[] = [
  {
    accessorKey: "material",
    header: "Material Code",
    cell: ({ row }) => {
      const material = row.getValue("material");
      const status = row.getValue("status");
      const materialDescription = row.getValue("materialDescription");

      const statusColor =
        status === "approved"
          ? "bg-green-600 text-green-50"
          : status === "pending"
          ? "bg-red-600 text-red-50"
          : "";

      return (
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="font-medium">{material}</div>
          <span className="w-28 truncate md:hidden">{materialDescription}</span>
          <span
            className={`px-2 py-1 rounded-2xl text-xs font-medium uppercase md:hidden w-20 ${statusColor}`}
          >
            {status}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "materialType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground ">
        {row.getValue("materialType")}
      </span>
    ),
  },
  {
    accessorKey: "materialGroup",
    header: () => <span className="hidden md:table-cell">Group</span>,
    cell: ({ row }) => (
      <div className="uppercase hidden md:table-cell">
        {row.getValue("materialGroup")}
      </div>
    ),
  },
  {
    accessorKey: "buom",
    header: () => <span className="hidden md:table-cell">BUOM</span>,
    cell: ({ row }) => (
      <div className="hidden md:table-cell">{row.getValue("buom")}</div>
    ),
  },
  {
    accessorKey: "materialDescription",
    header: () => <span className="hidden md:table-cell">Description</span>,
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate hidden md:table-cell"
        title={row.getValue("materialDescription")}
      >
        {row.getValue("materialDescription")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="hidden md:table-cell">Status</span>,
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
          className={`px-2 py-1 rounded-full text-xs font-medium uppercase hidden md:table-cell ${statusColor}`}
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
        <div className="flex items-start gap-1 md:gap-2 ">
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
