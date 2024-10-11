
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

/** @type import(@tanstack/react-table).ColumnDef<any> */
export const LawyerColumns = (expandedRows: any, setExpandedRows: any) => [

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
    header: () => <span className="w-max">Name</span>,
    accessorKey: "name",
    cell: (info: any) => (
      <span className="min-w-[150px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
        {info.getValue()?.toString() || "N/A"}
      </span>
    ),
    enableHiding: false,
  },
//   designation
  {
    header: () => <span className="w-max">Designation</span>,
    accessorKey: "designation",
    cell: (info: any) => (
      <span className="flex justify-start items-center w-fit min-w-max ">
        <Badge
          className="w-max text-center py-1 px-2"
          variant="default"
        >
          {info.getValue()}
        </Badge>
      </span>
    ),
    enableSorting:true
  },
  //   phone
  {
    header: () => <span className="w-max">Phone</span>,
    accessorKey: "phone",
    cell: (info: any) => (
      <span className="min-w-[120px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
        {info.getValue()?.toString() || "N/A"}
      </span>
    ),
  },
//   email
  {
    header: () => <span className="w-max">Email</span>,
    accessorKey: "email",
    cell: (info: any) => (
      <span className="min-w-[150px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
        {info.getValue()?.toString() || "N/A"}
      </span>
    ),
  },
// // Alternate Mobile Column
//   {
//     header: () => <span className="w-max">Alternate Mobile</span>,
//     accessorKey: "alternateMobile",
//     cell: (info: any) => (
//       <span className="min-w-[120px] w-fit whitespace-nowrap overflow-hidden text-ellipsis">
//         {info.getValue() || "N/A"}
//       </span>
//     ),
//   },
  //   D.O.B
  {
    header: () => <span className="w-max">D.O.B</span>,
    accessorKey: "dob",
    cell: ({ row }: { row: any }) => {
      const date = row.getValue("dob");
      if (!date) return <span>N/A</span>;
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-max min-w-[100px] items-center">
          <span className="capitalize">🎂 {formattedDate}</span>
        </div>
      );
    },
    filterFn: (row: any, id: string, value: [Date, Date]) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
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
  {
    header: () => <span className="w-max">Created At</span>,
    accessorKey: "_createdAt",
    cell: ({ row }: { row: any }) => {
      const date = row.getValue("_createdAt");
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
