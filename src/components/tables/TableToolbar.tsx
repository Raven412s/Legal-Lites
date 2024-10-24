import { deleteByToolbar } from '@/actions/deleteByToolbar';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'; // Import Dialog components
import { Input } from "@/components/ui/input";
import * as Tooltip from '@radix-ui/react-tooltip';
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { FileDown, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner"; // Import toast from Sonner
import { CalendarDatePicker } from '../calendar-date-picker';
import { TableViewOptions } from './TableViewOptions';

interface DataTableToolbarProps<TData> {
  filter: string;
  table: Table<TData>;
  filters: { name: string, value: string }[];
  linkToAdd: string;
  exportToExcel: (event: React.MouseEvent<HTMLButtonElement>) => void; // Specify the type
  setSearch: (search: string) => void;
  search: string;
  API: string;
  QueryKey: string;
  FormComponent?: React.ElementType; // Add FormComponent as a prop
  isDateFilter: boolean;
}

export function DataTableToolbar<TData>({
  isDateFilter,
  filter,
  API,
  table,
  filters,
  setSearch,
  exportToExcel,
  search,
  QueryKey,
  FormComponent // Receive the FormComponent as a prop
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For custom delete confirmation modal
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Store selected rows to delete

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("createdAt")?.setFilterValue([from, to]); // Filter based on date range
  };

  // Open custom delete modal
  const openDeleteModal = () => {
    const selectedRowIds = table.getFilteredSelectedRowModel().rows.map((row: any) => row.original._id);
    if (selectedRowIds.length > 0) {
      setSelectedRows(selectedRowIds);
      setIsDeleteModalOpen(true); // Open delete confirmation modal
    }
  };

  // Confirm delete
  const deleteMultiByToolbar = async () => {
    try {
      await deleteByToolbar(selectedRows, API);
      queryClient.invalidateQueries({ queryKey: [`${QueryKey}`] });
      toast.success(`${selectedRows.length} ${filter} deleted successfully`);
      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("An error occurred while deleting users");
    } finally {
      setIsDeleteModalOpen(false); // Close modal
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Left section - Add Team button */}
      <div className="flex items-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="hover:bg-transparent">
              Add {filter}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-6">
            {FormComponent && <FormComponent onClose={() => setIsDialogOpen(false)} />}
          </DialogContent>
        </Dialog>
      </div>

      {/* Right section - Search, Date Picker, and Icon Buttons */}
      <div className="flex items-center gap-2 w-full justify-end">
        {/* Search Input */}
        <Input
          placeholder="Search here..."
          value={search ?? ""}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isDateFilter===true  ? (
          // Date Picker
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="h-9 w-[250px]"
            variant="outline"
          />
        ):null}
        {/* Filter View Options */}
        <TableViewOptions table={table} />

        {/* Delete and Other Icons */}
        <div className="flex items-center gap-2">
          { table && table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button variant="outline" size="sm" onClick={openDeleteModal}>
                    <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                    ({table.getFilteredSelectedRowModel().rows.length})
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-gray-800 text-white p-2 rounded-md font-normal text-xs">
                  Delete Selected Rows
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}

          {/* Export to Excel Button */}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent p-0"
                  onClick={(event) => exportToExcel(event)} // Wrap in a callback function
                  aria-label="Export to Excel"
                >
                  <FileDown className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-gray-800 text-white p-2 rounded-md font-normal text-xs">
                Export to Excel
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete {selectedRows.length} {filter}?
            </p>
            <DialogFooter className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={deleteMultiByToolbar}>Confirm</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
