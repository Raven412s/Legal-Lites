import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Actions from "@/components/actions";
import { FaStar, FaRegStar } from "react-icons/fa"; // For star icons
import { Button } from "@/components/ui/button";

/** @type import(@tanstack/react-table).ColumnDef<any> */
export const LeadsColumns = (
  expandedRows: any,
  setExpandedRows: any,
  handleView: Function,
  handleEdit: Function,
  handleDelete: Function,
  handleCopy: Function,
) => [
  // Serial Number & Strong Lead
  {
    id: "serial-number",
    header: () => <span className="w-max">Sr.</span>,
    cell: (info: any) => {
      const lead = info.row.original;
      return (
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span>{Number(info.row.id) + 1}-</span>
            {lead.strong ? <FaStar style={{ color: "goldenrod" }} className="w-8 h-8" /> : <FaRegStar style={{ color: "goldenrod" }} className="w-8 h-8" />}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(lead.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) || "N/A"}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },

  // Lead Details (Name, Court, Case Type, Phone, Email)
  {
    id: "lead-details",
    header: () => <span className="w-max">Details</span>,
    cell: ({ row }: { row: any }) => {
      const lead = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold">{lead.name || "N/A"}</span>
          <div className="text-sm text-gray-600">
            {lead.court ? `${lead.court} | ${lead.caseType || "N/A"}` : "N/A"}
          </div>
          <div className="text-sm">
            <span>{lead.phone || "N/A"}</span>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },

  // Status, Follow-up Date, Last Comment
  {
    id: "status",
    header: () => <span className="w-max">Status</span>,
    cell: ({ row }: { row: any }) => {
      const lead = row.original;
      const lastComment = lead.comment ? lead.comment : "N/A"; // Get the last comment or default to "N/A"

      return (
        <div className="flex flex-col">
          <span>{lead.status || "N/A"}</span>
          <span className="text-sm text-gray-500">
            Next Follow-Up: {new Date(lead.nextFollowUp).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) || "N/A"}
          </span>
          <span className="text-sm text-gray-800">Last Comment: {lastComment}</span>
          <Button variant="default" size="sm" onClick={() => handleEdit(lead)}>
            Add Follow-Up
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },

  // Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <Actions
        viewFunction={() => handleView(row.original)}
        editFunction={() => handleEdit(row.original)}
        deleteFunction={() => handleDelete(row.original)}
        copyFunction={() => handleCopy(row.original)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
