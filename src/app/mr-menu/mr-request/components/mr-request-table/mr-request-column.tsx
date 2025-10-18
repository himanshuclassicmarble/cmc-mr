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
    cell: ({ row }) => (
      <MRRequestApproval data={row.original} onUpdate={onUpdate} />
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Crdt Date",
  },
  {
    accessorKey: "approvalDate",
    header: "Appr Date",
  },
  {
    accessorKey: "createdBy",
    header: "Crtd By",
  },
  {
    accessorKey: "approvedBy",
    header: "Appr By",
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
