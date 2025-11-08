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
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Columns3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { CreateMaterialRequest } from "../mr-request-forms/create-material-request";
import { MaterialRateValues } from "../mr-request-forms/schema";
import { materialMaster } from "@/app/mr-menu/material-master/data";
import { statusConst } from "../mr-request-forms/constants";

interface MRRequestProps {
  data: MaterialRateValues[];
  columns: ColumnDef<MaterialRateValues>[];
  onAddData: (newData: MaterialRateValues) => void;
}

export default function MRRequestTable({
  data,
  columns,
  onAddData,
}: MRRequestProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, columnFilters, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const toggleSort = (colId: string) => {
    const currentSort = sorting.find((s) => s.id === colId);
    if (!currentSort) {
      setSorting([{ id: colId, desc: false }]); // Ascending
    } else if (!currentSort.desc) {
      setSorting([{ id: colId, desc: true }]); // Descending
    } else {
      setSorting([]); // None
    }
  };

  const sortableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanSort());
  const defaultSortColId = sortableColumns[0]?.id || "id";
  const currentSort = sorting.find((s) => s.id === defaultSortColId);
  const sortLabel = !currentSort
    ? "No Sort"
    : currentSort.desc
      ? "Descending"
      : "Ascending";

  return (
    <div className="space-y-4">
      {/* Search + Column Toggle + Filter + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  setColumnFilters((prev) =>
                    prev.filter((f) => f.id !== "status"),
                  )
                }
              >
                All
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
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Columns3 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ✅ Simplified Sort Toggle Button */}
          <Button
            variant={currentSort ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => toggleSort(defaultSortColId)}
          >
            {currentSort ? (
              currentSort.desc ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )
            ) : (
              <ArrowUp className="h-4 w-4 opacity-30" />
            )}
            {sortLabel}
          </Button>
        </div>

        <CreateMaterialRequest
          materialOption={materialMaster}
          onAddData={onAddData}
        />
      </div>

      {/* Table */}
      <ScrollArea className="w-full rounded-md border border-border whitespace-nowrap">
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
                <TableRow key={row.id}>
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
        <div className="text-sm">
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
