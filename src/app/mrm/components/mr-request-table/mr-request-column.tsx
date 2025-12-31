import { ColumnDef } from "@tanstack/react-table";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { MaterialMaster } from "@/app/material-master/types";
import { ArrowDown, ArrowUp, PenOff } from "lucide-react";
import { Column } from "@tanstack/react-table";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request/edit-material-request";
import { MRRequestApproval } from "../mr-request-forms/approve-material-request/mr-request-approval";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/iso-date-formatter";

export const sortHeader = <T,>(title: string, column: Column<T>) => (
  <div
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="cursor-pointer flex items-center gap-1 select-none"
  >
    {title}
    {column.getIsSorted() === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="h-3 w-3" />
    ) : (
      <ArrowUp className="h-3 w-3 opacity-20" />
    )}
  </div>
);

export const getMRRequestColumns = (
  materialOption: MaterialMaster[],
  isAuthorised: boolean,
  currentUserEmail?: string,
): ColumnDef<MaterialRateValues>[] => [
  {
    id: "actions",
    header: "Act.",
    cell: ({ row }) => {
      const isRowOwner = row.original.createdBy === currentUserEmail;
      const isApproved = row.original.status === "approved";

      if (isRowOwner && !isApproved) {
        return (
          <EditMaterialRequest
            key={`${row.original.reqId}-${row.original.srNo}`}
            data={row.original}
            materialOption={materialOption}
          />
        );
      }

      return (
        <Button variant="ghost" disabled>
          <PenOff className="h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    accessorKey: "reqId",
    enableSorting: true,
    header: ({ column }) => sortHeader("Req ID", column),
  },

  {
    accessorKey: "srNo",
    enableSorting: true,
    header: ({ column }) => sortHeader("SR No", column),
  },

  {
    accessorKey: "materialCode",
    enableSorting: true,
    header: ({ column }) => sortHeader("MR Code", column),
  },

  {
    accessorKey: "description",
    header: "Description",
    filterFn: "includesString",
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <MRRequestApproval isAuthorised={isAuthorised} data={row.original} />
    ),
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId)).toLowerCase() ===
      String(filterValue).toLowerCase(),
  },

  {
    accessorKey: "materialGroup",
    header: "MR Group",
    filterFn: "includesString",
  },

  {
    accessorKey: "materialType",
    header: "MR Type",
    filterFn: "includesString",
  },

  {
    accessorKey: "qtyReq",
    enableSorting: true,
    header: ({ column }) => sortHeader("Qty Req", column),
  },

  {
    accessorKey: "qtyApproved",
    enableSorting: true,
    header: ({ column }) => sortHeader("Qty Appr", column),
  },

  {
    accessorKey: "qtyIssued",
    enableSorting: true,
    header: ({ column }) => sortHeader("Qty Iss", column),
  },
  {
    accessorKey: "uom",
    header: "UOM",
    filterFn: "includesString",
  },

  {
    accessorKey: "purpose",
    header: "Purpose",
    filterFn: "includesString",
  },

  {
    accessorKey: "createdDate",
    header: "Crdt. Date",
    enableColumnFilter: false,
    cell: ({ getValue }) => formatDate(getValue() as string),
  },

  {
    accessorKey: "createdBy",
    header: "Crtd. By",
    filterFn: "includesString",
  },

  {
    accessorKey: "approvalDate",
    header: "Appr. Date",
    enableColumnFilter: false,
    cell: ({ getValue }) => formatDate(getValue() as string),
  },

  {
    accessorKey: "approvedBy",
    header: "Appr By",
    filterFn: "includesString",
  },

  {
    accessorKey: "rejectedDate",
    header: "Rej, Dt",
    enableColumnFilter: false,
    cell: ({ getValue }) => formatDate(getValue() as string),
  },

  {
    accessorKey: "rejectedBy",
    header: "Rej. by",
    filterFn: "includesString",
  },

  {
    accessorKey: "rejectReason",
    header: "Rej. Rs.",
    filterFn: "includesString",
  },
];
