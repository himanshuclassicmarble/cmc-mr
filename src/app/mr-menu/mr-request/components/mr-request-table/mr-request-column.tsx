"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { MRRequest } from "../../types";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request";
import { Badge } from "@/components/ui/badge";
import { MRRequestApproval } from "../mr-request-forms/mr-request-approval";
import { materialOption } from "./data";

export const mrRequestColumn: ColumnDef<MRRequest>[] = [
  {
    accessorKey: "material",
    header: "Material Code ",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("material")}</div>
    ),
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <MRRequestApproval data={row.original} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-2">
          <EditMaterialRequest materialOption={materialOption} />
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
