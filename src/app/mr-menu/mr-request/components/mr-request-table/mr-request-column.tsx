"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MRRequestApproval } from "../mr-request-forms/mr-request-approval";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request";
import { MaterialMaster } from "@/app/mr-menu/material-master/types";

export const getMRRequestColumns = (
  onUpdate: (
    reqId: string,
    srNo: string,
    updatedData: Partial<MaterialRateValues>,
  ) => void,
  materialOption: MaterialMaster[],
): ColumnDef<MaterialRateValues>[] => [
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
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.status, // this gives filter access to the raw value

    cell: ({ row }) => (
      <MRRequestApproval data={row.original} onUpdate={onUpdate} />
    ),

    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue(columnId)).toLowerCase();
      return cellValue === String(filterValue).toLowerCase();
    },
  },
  {
    accessorKey: "createdDate",
    header: "Crdt. Date",
  },
  {
    accessorKey: "approvalDate",
    header: "Appr. Date",
  },
  {
    accessorKey: "createdBy",
    header: "Crtd. By",
  },
  {
    accessorKey: "approvedBy",
    header: "Appr By",
  },
  {
    accessorKey: "rejectedBy",
    header: "Rej. by",
  },
  {
    accessorKey: "rejectedDate",
    header: "Rej, Dt",
  },
  {
    accessorKey: "rejectReason",
    header: "Rej. Rs.",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <EditMaterialRequest
        key={`${row.original.reqId}-${row.original.srNo}`}
        data={row.original}
        materialOption={materialOption}
        onUpdate={onUpdate}
      />
    ),
  },
];
