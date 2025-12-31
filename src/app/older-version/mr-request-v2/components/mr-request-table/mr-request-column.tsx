import { ColumnDef } from "@tanstack/react-table";
import { MRRequestApproval } from "../mr-request-forms/mr-request-approval";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request";
import { MaterialMaster } from "@/app/mr-menu/material-master/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Column } from "@tanstack/react-table";

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
  user: string,
  onUpdate: (
    reqId: string,
    srNo: string,
    updatedData: Partial<MaterialRateValues>,
  ) => void,
  materialOption: MaterialMaster[],
): ColumnDef<MaterialRateValues>[] => [
  {
    id: "actions",
    header: "Act.",
    cell: ({ row }) => (
      <EditMaterialRequest
        key={`${row.original.reqId}-${row.original.srNo}`}
        data={row.original}
        materialOption={materialOption}
        onUpdate={onUpdate}
      />
    ),
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
      <MRRequestApproval data={row.original} onUpdate={onUpdate} user={user} />
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
    accessorKey: "materialType",
    header: "MR Type",
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
