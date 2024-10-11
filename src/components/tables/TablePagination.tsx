import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
  } from "@radix-ui/react-icons";
  import { Button } from "@/components/ui/button";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

  interface DataTablePaginationProps {
    totalPages: number;
    currentPage: number;
    setPage: (page: number) => void;
    rowPerPage: number;
    setRowPerPage: (rowsPerPage: number) => void;
    total:number
  }

  export function DataTablePagination({
    totalPages,
    currentPage,
    setPage,
    rowPerPage,
    setRowPerPage,
    total
  }: DataTablePaginationProps) {
    return (
      <div className="flex flex-col items-center justify-between space-y-4 px-2 lg:flex-row lg:space-y-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
        <Select value={`${rowPerPage}`} onValueChange={(value) => setRowPerPage(Number(value))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[6, 10, 20, 30, 40, 50,75, 100, total].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
