
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { ChevronsUpDown, LucideArrowDownAz, LucideArrowUpAz } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { utils, writeFile } from 'xlsx';
import { DataTablePagination } from "./TablePagination";
import { DataTableToolbar } from "./TableToolbar";

interface DataTableProps<TData, TValue> {
    isDateFilter: boolean,
    filter:string,
    API:string,
    deletePermission?: string,
    editPermission?: string,
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: {
    name: string,
    value: string
  }[];
  linkToAdd: string;
  refetch: Function;
  handleDelete: Function;
  handleEdit: Function;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
    search: string;
  rowPerPage: number;
  setRowPerPage: (rowsPerPage: number) => void;
  totalData: number;
    total: number;
    dataLoading: boolean
    QueryKey: string
    FormComponent?: React.ElementType;
}

export function DataTable<TData, TValue>({
    isDateFilter,
    filter,
    API,
  columns,
  data,
  filters,
  linkToAdd,
  refetch,
  handleDelete,
  handleEdit,
  totalPages,
  currentPage,
  setPage,
    rowPerPage,
  setSearch,
  setRowPerPage,
  totalData,
    total,
    deletePermission,
    editPermission,
    search,
    dataLoading,
    QueryKey,
    FormComponent
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Setup the table instance with custom filtering logic
  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: rowPerPage,
      },
    globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onPaginationChange: (updater: any) => {
      setPage(updater.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const exportToExcel = () => {
    // Extract rows and columns
    const tableData = table.getRowModel().rows.map(row => {
      const flattenedRow: Record<string, unknown> = {};
      Object.entries(row.original as Record<string, unknown>).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
            if (key === 'vendor' && subKey === 'products') {
              (subValue as unknown[]).forEach((product, index) => {
                if (typeof product === 'object' && product !== null) {
                  Object.entries(product as Record<string, unknown>).forEach(([productKey, productValue]) => {
                    flattenedRow[`${key}.${subKey}.${index}.${productKey}`] = productValue;
                  });
                }
              });
            } else {
              flattenedRow[`${key}.${subKey}`] = subValue;
            }
          });
        } else {
          flattenedRow[key] = value;
        }
      });
      return flattenedRow;
    });

    // Convert data into worksheet
    const worksheet = utils.json_to_sheet(tableData);

    // Create a new workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Report');

    // Generate Excel file and download it
    writeFile(workbook, 'report.xlsx');
  };



  const handleCellClick = (e: React.MouseEvent, row: any, cell: any) => {
    const cellValue = cell.getValue();
    const isTruncated = ['address', 'permissions', 'vendor_products'].includes(cell.column.id);
    const isImage = typeof cellValue === 'string' && (cellValue.startsWith('http://') || cellValue.startsWith('https://'));
  const isCheckbox = cell.column.id === 'select';
  // Optional: Log the click for tracking
  console.log(`Cell clicked: Row ID ${row.original._id}, Cell Value: ${cellValue}`);
 if (!isTruncated && !isCheckbox && !isImage) {
   editPermission ?  handleEdit(row.original._id) : null
  }
};

  return (
    <div className="space-y-4 min-w-max ">
      <DataTableToolbar
      isDateFilter={isDateFilter}
       FormComponent={FormComponent}
      filter={filter}
        table={table}
        filters={filters!}
        linkToAdd={linkToAdd}
        exportToExcel={exportToExcel}
              setSearch={setSearch}
              search={search}
              API={API}
              QueryKey={QueryKey}
      />
<div className="overflow-x-auto overflow-y-auto rounded-md border shadow-inner custom-scrollbar w-full max-w-full">
  <Table className="min-w-[700px] w-full">
    {/* Table Header */}
    <TableHeader className="sticky top-0">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              className="px-2 py-3 text-xs sm:px-4 sm:py-4"
              key={header.id}
              colSpan={header.colSpan}
              onClick={(e) => {
                e.preventDefault(); // Prevent default to avoid any unwanted behavior
                header.column.getToggleSortingHandler(); // Call sorting handler
              }}
            >
              {!header.isPlaceholder && (
                <div className="flex items-center gap-1">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.id !== "select" && (
                    header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "asc" ? (
                        <LucideArrowUpAz className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <LucideArrowDownAz className="w-3 h-3 sm:w-4 sm:h-4" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    )
                  )}
                </div>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>

    {/* Table Body */}
    <TableBody>
      {data && table.getRowModel().rows.length > 0 && (
        table.getRowModel().rows.map((row: any) => (
          <React.Fragment key={row.id}>
            <TableRow data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell: any) => (
                <TableCell
                  className="px-2 py-2 text-xs sm:px-4 sm:py-3"
                  key={cell.id}
                  onClick={(e) => handleCellClick(e, row, cell)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell className="p-0" />
            </TableRow>
          </React.Fragment>
        )))}
    </TableBody>
  </Table>
</div>

      {totalData > 5 ? (
        <DataTablePagination
          total={total}
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setPage}
          rowPerPage={rowPerPage}
          setRowPerPage={setRowPerPage}
        />
      ) : null}
    </div>
  );
}
