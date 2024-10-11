import * as Tooltip from '@radix-ui/react-tooltip';
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { FileDown, PlusCircle, RefreshCcw, TrashIcon } from "lucide-react";
import { TableFacetedFilter } from "./TableFacetedFilter";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Import toast from Sonner
import { TableViewOptions } from './TableViewOptions';

import { deleteByToolbar } from '@/actions/deleteByToolbar';
import { CalendarDatePicker } from '../calendar-date-picker';

interface DataTableToolbarProps<TData> {
    filter:string,
  table: Table<TData>;
  filters: {
    name: string,
    value: string
  }[];
  linkToAdd: string;
  refetch: Function;
    exportToExcel: Function;
    setSearch: (search: string) => void;
    search: string
    API:string
    QueryKey:string
}

export function DataTableToolbar<TData>({
    filter,
    API,
  table,
  filters,
  linkToAdd,
    refetch,
  setSearch,
  exportToExcel,
  search,
  QueryKey

}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("_createdAt")?.setFilterValue([from, to]); // Filter based on date range
  };

  // Function to handle deletion of selected rows
  const deleteMultiByToolbar = async () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row: any) => row.original._id);

    if (selectedRows.length > 0) {
      // Show confirmation before deleting
      const confirmed = confirm(
        `Are you sure you want to delete ${selectedRows.length} ${filter}?`
      );
      if (!confirmed) return;

      try {
        await deleteByToolbar(selectedRows,API);
        queryClient.invalidateQueries({ queryKey: [`${QueryKey}`] });
        toast.success(`${selectedRows.length} ${filter} deleted successfully`);
        table.resetRowSelection();
      } catch (error) {
        console.error("Error deleting users:", error);

        // Show error toast notification
        toast.error("An error occurred while deleting users");
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
       <Input
          placeholder="Search here..."
          value={search ?? ""}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filters ? (
          <TableFacetedFilter
            column={table.getColumn(`${filter}`)}
            title={`${filter}`}
            options={filters}
          />
        ) : null}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
          <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 w-[250px]"
          variant="outline"
        />
      </div>
      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button variant="outline" size="sm" onClick={deleteMultiByToolbar}>
                  <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                  ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-gray-800 text-white p-2 rounded-md font-normal text-xs">
                Delete Selected Rows
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        ) : null}

        <TableViewOptions table={table} />

        <div className="flex justify-between items-center gap-2">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent p-0"
                  onClick={() => exportToExcel()}
                  aria-label="Export to Excel"
                >
                  <FileDown className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-gray-800 text-white p-2 rounded-md font-normal text-xs">
                Export to Excel
              </Tooltip.Content>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent p-0"
                  onClick={() => refetch()}
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-gray-800 text-white p-2 rounded-md font-normal text-xs">
                Refresh Table Data
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <Link href={`${linkToAdd}/add`}>
          <PlusCircle className="w-6 h-6 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
