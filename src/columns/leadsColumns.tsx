import Actions from "@/components/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // Import useState for managing state
import { FaRegStar, FaStar } from "react-icons/fa";

// Assuming you have a list of statuses you want to use
const statusOptions = ["Fresh", "Open", "File Received", "Not Interested"];

// Function to update the lead's status in the database
const updateLeadStatus = async (leadId: string, newStatus: string) => {
  try {
    // Replace this with your API endpoint
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH', // Use PATCH or PUT based on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    // Handle success if needed
    console.log('Status updated successfully');
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

export const LeadsColumns = (
  expandedRows: any,
  setExpandedRows: any,
  handleView: Function,
  handleEdit: Function,
  handleDelete: Function,
  handleCopy: Function,
) => [
  // Serial Number & Strong Lead (remains unchanged)
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

  // Lead Details (remains unchanged)
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

  // Editable Status Field
  {
    id: "status",
    header: () => <span className="w-max">Status</span>,
    cell: ({ row }: { row: any }) => {
      const lead = row.original;
      console.log("lead._id",lead._id)
      const [status, setStatus] = useState(lead.status as string); // Local state for status

      const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus); // Update local state
        await updateLeadStatus(lead._id, newStatus); // Update the status in the database
      };

      return (
        <div className="flex flex-col">
          <select
            value={status}
            onChange={handleChange}
            className="border rounded p-1 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            Next Follow-Up: {new Date(lead.nextFollowUp).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) || "N/A"}
          </span>
          <span className="text-sm text-gray-800">Last Comment: {lead.comment || "N/A"}</span>
          <Button variant="default" size="sm" onClick={() => handleEdit(lead)}>
            Add Follow-Up
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },

  // Actions (remains unchanged)
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
