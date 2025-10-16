"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MRRequestApproval } from "../mr-request-forms/mr-request-approval";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { MaterialOption } from "./types";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request";

export const getMRRequestColumns = (
  onUpdate: (
    reqId: string,
    srNo: string,
    updatedData: Partial<MaterialRateValues>,
  ) => void,
  materialOption: MaterialOption[],
): ColumnDef<MaterialRateValues>[] => [
  {
    accessorKey: "reqId",
    header: "Request ID",
  },
  {
    accessorKey: "srNo",
    header: "SR No",
  },
  {
    accessorKey: "materialCode",
    header: "Material Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "materialGroup",
    header: "Material Group",
  },
  {
    accessorKey: "qtyReq",
    header: "Qty Requested",
  },
  {
    accessorKey: "qtyApproved",
    header: "Qty Approved",
  },
  {
    accessorKey: "qtyIssued",
    header: "Qty Issued",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
  {
    accessorKey: "materialType",
    header: "Material Type",
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
    header: "Created Date",
  },
  {
    accessorKey: "approvalDate",
    header: "Approval Date",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <EditMaterialRequest
        data={row.original}
        materialOption={materialOption}
        onUpdate={onUpdate}
      />
    ),
  },
];
