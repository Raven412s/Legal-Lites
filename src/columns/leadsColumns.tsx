import Actions from "@/components/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

const statusOptions = ["Fresh", "Open", "File Received", "Not Interested", "Pending" ,"Active"];

// Function to update the lead's status or strong field in the database
const updateLeadField = async (leadId: string, updatedField: object) => {
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedField),
    });

    if (!response.ok) {
      throw new Error('Failed to update lead');
    }

    console.log('Lead updated successfully');
  } catch (error) {
    console.error('Error updating lead:', error);
  }
};

export const LeadsColumns = (
  expandedRows: any,
  setExpandedRows: any,
  handleView: Function,
  handleEdit: Function,
  handleAddFollowUp: Function,
  handleDelete: Function,
  handleCopy: Function,
) => [
  {
    id: "lead-details",
    header: () => <span className="w-max">Details</span>,
    cell: ({ row }: { row: any }) => {
      const lead = row.original;
      const [isStrong, setIsStrong] = useState(lead.strong);
      const queryClient = useQueryClient();
      const toggleStrong = async () => {
        const newStrongValue = !isStrong;
        setIsStrong(newStrongValue); // Toggle locally
        await updateLeadField(lead._id, { strong: newStrongValue }); // Update in the database
        queryClient.invalidateQueries({ queryKey: ["leads"] })
      };

      return (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <span className="font-bold text-lg">{lead.name || "N/A"}</span>
               <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleStrong} // Click handler for toggling strong value
          >
            {isStrong ? (
              <FaStar style={{ color: "goldenrod" }} className="w-5 h-5" />
            ) : (
              <FaRegStar style={{ color: "goldenrod" }} className="w-5 h-5" />
            )}
          </div>
        </div>
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

  {
    id: "status",
    header: () => <span className="w-max">Status</span>,
    cell: ({ row }: { row: any }) => {
      const lead = row.original;
      const [status, setStatus] = useState(lead.status as string);
      const queryClient = useQueryClient();
      const handleChange = async (newStatus: string) => {
        setStatus(newStatus);
        await updateLeadField(lead._id, { status: newStatus });
        queryClient.invalidateQueries({ queryKey: ["leads"] });
      };


      return (
        <div className="flex flex-col gap-1 w-[200px]">
         <Select value={status} onValueChange={handleChange}>
  <SelectTrigger className="border rounded w-max h-max !p-0 text-sm">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    {statusOptions.map((option) => (
      <SelectItem key={option} value={option}>
        {option}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          <span className="text-sm text-gray-500">
            Next Follow-Up: {new Date(lead.nextFollowUp).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) || "N/A"}
          </span>
          <span className="text-sm text-gray-800">Last Comment: {lead.comment || "N/A"}</span>
          <Button variant="default" size="sm" onClick={() => handleAddFollowUp(lead._id)} className="px-2 w-max">
            Add Follow-Up
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    id: "createdAt",
    header: "Created At",
    cell: ({ row }: any) => {
        const lead = row.original
    return (
         <div className="text-sm">
        <span>lead created on: {"  "}
        <span className="text-sm text-gray-500">
        {new Date(lead.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) || "N/A"}
      </span>
        </span>
      </div>
      )},
    enableSorting: false,
    enableHiding: false,
  },
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
