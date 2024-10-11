
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
import { toast } from "sonner";
import { utils, writeFile } from 'xlsx';
import { DataTablePagination } from "./TablePagination";
import { DataTableToolbar } from "./TableToolbar";
import Actions from "../actions";

interface DataTableProps<TData, TValue> {
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
}

export function DataTable<TData, TValue>({
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
    dataLoading
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

  const handleCopy = (rowData: any) => {
  try {
    // Convert the row data to a JSON string
    const jsonData = JSON.stringify(rowData, null, 2);

    // Use the clipboard API to copy the JSON data
    navigator.clipboard.writeText(jsonData);

    // Show a success message
    toast.success("Row data copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy row data to clipboard:", error);
    toast.error("Failed to copy data to clipboard.");
  }
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
    <div className="space-y-4 min-w-max">
      <DataTableToolbar
      filter={filter}
        table={table}
        filters={filters!}
        linkToAdd={linkToAdd}
        refetch={refetch}
        exportToExcel={exportToExcel}
              setSearch={setSearch}
              search={search}
              API={API}
      />
      <div className="overflow-y-auto rounded-md border shadow-inner max-w-[calc(100vw-340px)] custom-scrollbar">
     <Table className="min-h-max">
  {/* Table Header */}
  <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead
            className="px-4 py-4"
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
                      <LucideArrowUpAz className="w-4 h-4 " />
                    ) : (
                      <LucideArrowDownAz className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )
                )}
              </div>
            )}
          </TableHead>
        ))}
        <TableHead className="w-[100px]"></TableHead>
      </TableRow>
    ))}
  </TableHeader>

  {/* Table Body */}
  <TableBody className="">
    {data && table.getRowModel().rows.length > 0 ? (
      table.getRowModel().rows.map((row: any) => (
        <React.Fragment key={row.id}>
          <TableRow data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell: any) => (
              <TableCell
                className="px-4 py-0 "
                key={cell.id}
                onClick={(e) => handleCellClick(e, row, cell)}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            <TableCell className="p-0">
              <Actions
                deleteFunction={() => handleDelete(row?.original._id)}
                editFunction={() => handleEdit(row?.original._id)}
                copyFunction={() => handleCopy(row?.original)}
              />
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))
    ) : (
      <TableRow className="flex items-center justify-center min-w-[75rem] h-80">
        <TableCell className="p-10 mt-10">
            <div className="flex flex-col items-center justify-center gap-1 text-start">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no Lawyers
            </h3>
            <p className="text-sm text-muted-foreground">
              You can view all Users here as soon as you add one.
            </p>
            <Link href={"/lawyers/add"} className="mt-4">
              <Button>Add User</Button>
            </Link>
          </div>
        </TableCell>
      </TableRow>
    )}
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
