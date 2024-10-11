
import { Checkbox } from "@/components/ui/checkbox";

/** @type import(@tanstack/react-table).ColumnDef<any> */
export const TeamColumns = (expandedRows: any, setExpandedRows: any) => [

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
    //  sr. no.
{
    id:"serial-number",
    header: () => <span className="w-max">Sr.</span>,
    cell: (info: any) => (
      <span className="min-w-[150px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
        {Number(info.row.id)+1}
      </span>
    ),
    enableHiding: false,
},
//   name
  {
    header: () => <span className="w-max">Team Name</span>,
    accessorKey: "teamName",
    cell: (info: any) => (
      <span className="min-w-[150px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
        {info.getValue()?.toString() || "N/A"}
      </span>
    ),
    enableHiding: false,
  },
  {
    header: () => <span className="w-max">Created At</span>,
    accessorKey: "createdAt",
    cell: ({ row }: { row: any }) => {
      const date = row.getValue("createdAt");
      if (!date) return <span>N/A</span>;
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-fit min-w-[100px] items-center">
          <span className="capitalize"> {formattedDate}</span>
        </div>
      );
    },
    filterFn: (row: any, id: string, value: [Date, Date]) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },

]
