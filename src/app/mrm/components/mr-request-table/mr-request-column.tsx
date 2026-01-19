import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown, PenOff } from "lucide-react";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { MaterialMaster } from "@/app/material-master/types";
import { EditMaterialRequest } from "../mr-request-forms/edit-material-request/edit-material-request";
import { MRRequestApproval } from "../mr-request-forms/approve-material-request/mr-request-approval";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/iso-date-formatter";

const SortableHeader = ({
  title,
  column,
}: {
  title: string;
  column: Column<MaterialRateValues>;
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-auto p-0 font-medium hover:bg-transparent -ml-4"
  >
    {title}
    {column.getIsSorted() === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
    )}
  </Button>
);

export const getMRRequestColumns = (
  materialOptions: MaterialMaster[],
  isAuthorised: boolean,
  currentUserEmail?: string,
): ColumnDef<MaterialRateValues>[] => [
  // Actions Column
  {
    id: "actions",
    header: "Act.",
    enableSorting: false,
    enableHiding: false,
    size: 60,
    meta: { align: "center" },
    cell: ({ row }) => {
      const { original } = row;
      const isOwner = original.createdBy === currentUserEmail;
      const canEdit = original.status === "pending" && isOwner;

      return canEdit ? (
        <EditMaterialRequest
          key={`${original.reqId}-${original.srNo}`}
          data={original}
          materialOption={materialOptions}
        />
      ) : (
        <Button variant="ghost" size="icon" disabled className="h-8 w-8">
          <PenOff className="h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
  },

  // Common sortable columns
  {
    accessorKey: "reqId",
    header: ({ column }) => <SortableHeader title="Req ID" column={column} />,
  },
  {
    accessorKey: "srNo",
    header: ({ column }) => <SortableHeader title="SR No" column={column} />,
  },
  {
    accessorKey: "materialCode",
    header: ({ column }) => <SortableHeader title="MR Code" column={column} />,
  },

  // Description (filterable)
  {
    accessorKey: "description",
    header: "Description",
    filterFn: "includesString",
    size: 300,
  },

  // Status with approval component
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => {
      const restrictedStatuses = [
        "approved",
        "open",
        "closed",
        "partially open",
      ];
      const isRestricted = restrictedStatuses.includes(row.original.status);
      return (
        <MRRequestApproval
          isAuthorised={isAuthorised}
          data={row.original}
          isDisabled={isRestricted}
        />
      );
    },
  },

  // Material Group & Type (filterable)
  {
    accessorKey: "materialGroup",
    header: "MR Group",
    filterFn: "includesString",
    size: 120,
  },
  {
    accessorKey: "materialType",
    header: "MR Type",
    filterFn: "includesString",
    size: 100,
  },

  // Quantities (sortable)
  {
    accessorKey: "qtyReq",
    header: ({ column }) => <SortableHeader title="Qty Req" column={column} />,
    size: 90,
  },
  {
    accessorKey: "qtyApproved",
    header: ({ column }) => <SortableHeader title="Qty Appr" column={column} />,
    size: 90,
  },
  {
    accessorKey: "qtyIssued",
    header: ({ column }) => <SortableHeader title="Qty Iss" column={column} />,
    size: 90,
  },

  // UOM & Purpose
  { accessorKey: "uom", header: "UOM", filterFn: "includesString", size: 80 },
  {
    accessorKey: "purpose",
    header: "Purpose",
    filterFn: "includesString",
    size: 250,
  },

  // Dates (formatted)
  {
    accessorKey: "createdDate",
    header: "Crdt. Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
    enableColumnFilter: false,
  },
  {
    accessorKey: "approvalDate",
    header: "Appr. Date",
    cell: ({ getValue }) =>
      getValue() ? formatDate(getValue() as string) : "-",
    enableColumnFilter: false,
  },
  {
    accessorKey: "rejectedDate",
    header: "Rej. Date",
    cell: ({ getValue }) =>
      getValue() ? formatDate(getValue() as string) : "-",
    enableColumnFilter: false,
  },

  // Users & Reason
  { accessorKey: "createdBy", header: "Crtd. By", filterFn: "includesString" },
  { accessorKey: "approvedBy", header: "Appr By", filterFn: "includesString" },
  { accessorKey: "rejectedBy", header: "Rej. By", filterFn: "includesString" },
  {
    accessorKey: "rejectReason",
    header: "Rej. Reason",
    filterFn: "includesString",
    size: 200,
    cell: ({ getValue }) => getValue() || "-",
  },
];
