"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MRRequestApproval } from "../mr-request-forms/mr-request-approval";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request";
import { MaterialMaster } from "@/app/mr-menu/material-master/types";

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
  },
  {
    accessorKey: "reqId",
    header: "Req ID",
  },
  {
    accessorKey: "srNo",
    header: "SR No",
  },
  {
    accessorKey: "materialCode",
    header: "MR Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.status, // this gives filter access to the raw value

    cell: ({ row }) => (
      <MRRequestApproval data={row.original} onUpdate={onUpdate} user={user} />
    ),

    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue(columnId)).toLowerCase();
      return cellValue === String(filterValue).toLowerCase();
    },
  },
  {
    accessorKey: "materialGroup",
    header: "MR Group",
  },
  {
    accessorKey: "qtyReq",
    header: "Qty Req",
  },
  {
    accessorKey: "qtyApproved",
    header: "Qty Appr",
  },
  {
    accessorKey: "qtyIssued",
    header: "Qty Iss",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
  {
    accessorKey: "materialType",
    header: "MR Type",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    accessorKey: "createdDate",
    header: "Crdt. Date",
  },
  {
    accessorKey: "createdBy",
    header: "Crtd. By",
  },
  {
    accessorKey: "approvalDate",
    header: "Appr. Date",
  },
  {
    accessorKey: "approvedBy",
    header: "Appr By",
  },
  {
    accessorKey: "rejectedDate",
    header: "Rej, Dt",
  },
  {
    accessorKey: "rejectedBy",
    header: "Rej. by",
  },
  {
    accessorKey: "rejectReason",
    header: "Rej. Rs.",
  },
];
