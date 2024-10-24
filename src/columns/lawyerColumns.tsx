import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Actions from "@/components/actions";

/** @type import(@tanstack/react-table).ColumnDef<any> */
export const LawyerColumns = (expandedRows: any, setExpandedRows: any,  handleView: Function, handleEdit: Function, handleDelete: Function, handleCopy: Function) => [

    // select
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    },
// PERSONAL DETAILS
  {
    header: () => <span className="w-max">personal Details</span>,
    accessorKey: "personalDetails",
    cell: ({ row }: { row: any }) => (
      <div className="flex flex-col gap-2 my-1">
        <span className="min-w-[120px]  whitespace-nowrap overflow-hidden text-ellipsis">
          {row.original.title.toString()} {row.original.name?.toString() || "N/A"}
        </span>
        <Badge
          className="w-max text-center py-1 px-2"
          variant="default"
        >
        <span className="min-w-[150px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
          {row.original.designation?.toString() || "N/A"}
        </span>
        </Badge>
      </div>
    ),
    enableSorting:true
  },
  //   contact details
  {
    header: () => <span className="w-max">Contact Details</span>,
    accessorKey: "contactDetails",
    cell: ({ row }: { row: any }) => (
      <div className="flex flex-col gap-2 my-1">
        <span className="min-w-[120px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
          {row.original.phone?.toString() || "N/A"}
        </span>
        <span className="min-w-[120px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
          {row.original.email?.toString() || "N/A"}
        </span>
      </div>
    ),
    enableSorting:true
  },
// bciRegistrationNo
{
    header: () => <span className="w-max">BCI Reg. no.</span>,
    accessorKey: "bciRegistrationNo",
    cell: (info: any) => (
      <span className="min-w-[150px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
        {info.getValue()?.toString() || "N/A"}
      </span>
    ),
  },
   // actions column
   {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <Actions
        viewFunction={() => handleView(row.original)}
        editFunction={() => handleEdit(row.original)}
        deleteFunction={() => handleDelete(row.original)}
        // copyFunction={() => handleCopy(row.original)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
