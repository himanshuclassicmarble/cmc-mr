"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Download,
  ListFilter,
  Search,
} from "lucide-react";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { statusConst } from "../mr-request-forms/constants";
import { CreateMaterialRequest } from "../mr-request-forms/create-material-request/create-material-request";
import { MaterialOption } from "../mr-request-forms/types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate } from "@/lib/utils/iso-date-formatter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MRRequestProps {
  data: MaterialRateValues[];
  columns: ColumnDef<MaterialRateValues>[];
  materialMaster: MaterialOption[];
}

export default function MRRequestTable({
  data,
  columns,
  materialMaster,
}: MRRequestProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const activeStatus: string =
    (columnFilters.find((f) => f.id === "status")?.value as string) || "All";

  const handleExportXlsx = () => {
    const rows = table.getFilteredRowModel().rows;

    if (!rows.length) return;

    const exportData = rows.map((row) => {
      const r = row.original;

      return {
        "Req ID": r.reqId,
        "SR No": r.srNo,
        "Material Code": r.materialCode,
        Description: r.description,
        "Material Group": r.materialGroup,
        "Material Type": r.materialType,
        "Qty Requested": r.qtyReq,
        "Qty Approved": r.qtyApproved ?? "",
        "Qty Issued": r.qtyIssued ?? "",
        UOM: r.uom,
        Purpose: r.purpose,
        Status: r.status,

        "Created Date": r.createdDate ? formatDate(r.createdDate) : "",
        "Created By": r.createdBy,

        "Approved Date": r.approvalDate ? formatDate(r.approvalDate) : "",
        "Approved By": r.approvedBy ?? "",

        "Rejected Date": r.rejectedDate ? formatDate(r.rejectedDate) : "",
        "Rejected By": r.rejectedBy ?? "",
        "Reject Reason": r.rejectReason ?? "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "MR Requests");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `material-requests-${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search material requests..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-background shadow-sm transition-all focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 border-dashed"
              >
                <ListFilter className="h-4 w-4" />
                <span className="hidden sm:inline">Status:</span>
                <span className="font-semibold text-primary">
                  {activeStatus}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  setColumnFilters((prev) =>
                    prev.filter((f) => f.id !== "status"),
                  )
                }
                className="cursor-pointer"
              >
                <div className="flex items-center flex-1">
                  {activeStatus === "All" && (
                    <Check className="mr-2 h-4 w-4 text-primary" />
                  )}
                  <span
                    className={activeStatus === "All" ? "font-medium" : "ml-6"}
                  >
                    All Statuses
                  </span>
                </div>
              </DropdownMenuItem>

              {statusConst.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() =>
                    setColumnFilters((prev) => [
                      ...prev.filter((f) => f.id !== "status"),
                      { id: "status", value: status },
                    ])
                  }
                  className="cursor-pointer"
                >
                  <div className="flex items-center flex-1">
                    {activeStatus === status && (
                      <Check className="mr-2 h-4 w-4 text-primary" />
                    )}
                    <span
                      className={
                        activeStatus === status ? "font-medium" : "ml-6"
                      }
                    >
                      {status}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Export Data</DialogTitle>
                <DialogDescription>
                  Download the current table data for offline use or reporting.
                  Export respects applied filters and sorting.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3 mt-4">
                <Button
                  variant="outline"
                  className="justify-start gap-3 h-10"
                  onClick={handleExportXlsx}
                >
                  <Download className="h-4 w-4" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">Excel (.xlsx)</span>
                    <span className="text-xs text-muted-foreground">
                      Best for analysis and sharing
                    </span>
                  </div>
                </Button>

                {/*
                <Button variant="outline" disabled className="justify-start gap-3 h-10">
                  <FileText className="h-4 w-4" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">CSV</span>
                    <span className="text-xs text-muted-foreground">
                      Coming soon
                    </span>
                  </div>
                </Button>
                */}
              </div>
            </DialogContent>
          </Dialog>
          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

          <CreateMaterialRequest materialOption={materialMaster} />
        </div>
      </div>
      <ScrollArea className="w-full rounded-md border border-border whitespace-nowrap pb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-2 py-1 text-xs font-semibold bg-muted/50"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`${
                    row.original.status === "rejected"
                      ? "bg-red-500/30"
                      : row.original.status === "approved"
                        ? "bg-green-500/30"
                        : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-1 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
