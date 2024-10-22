"use client"
import { deleteByID } from '@/actions/deleteByID'
import { getAllLeads } from '@/actions/getAllLeads'
import { LeadsColumns } from '@/columns/leadsColumns'
import { EditLawyerForm } from '@/components/forms/Lawyer/EditLawyerForm'; // Import the Edit Lawyer form
import { AddLeadsForm } from '@/components/forms/Leads/AddLeadsForm'
import { EditLeadForm } from '@/components/forms/Leads/EditLeadsForm';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { LeadsDetailsModal } from '@/components/modals/LeadsDetailsModal'
import { DataTable } from '@/components/tables/DataTable'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // For modal
import { ILeads } from '@/interfaces/interface'
import noData from "@/public/images/no.png"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface LeadsResponse {
  leads: ILeads[];
  total: number;
}

const ViewLeadsPage = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedLead, setSelectedLead] = useState<ILeads | null>(null); // State to hold the selected lawyer for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [leadToDelete, setLeadToDelete] = useState<ILeads | null>(null); // Track the lawyer to delete
const [isAddModalOpen,setIsAddModalOpen] = useState(false)
  const queryClient = useQueryClient();
  const router = useRouter();

  // States for pagination, search, and filters
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery<LeadsResponse, Error>({
    queryKey: ["leads", { page, rowPerPage, search, designation }],
    queryFn: () => getAllLeads({ page, pageSize: rowPerPage, search, designation }),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteByID(id, "leads"),
    onSuccess: () => {
      toast.success("leads deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  // Edit user handler to open modal
  const handleEdit = (lead: ILeads) => {
    setSelectedLead(lead); // Set the selected lawyer to the one being edited
    setIsEditModalOpen(true); // Open the modal
  };

 // Handler to open the delete modal
 const handleDelete = (lead: ILeads) => {
    setLeadToDelete(lead); // Set the selected lawyer to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleCopy = (rowData: any) => {
    try {
      const jsonData = JSON.stringify(rowData, null, 2);
      navigator.clipboard.writeText(jsonData);
      toast.success("Row data copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy row data to clipboard:", error);
      toast.error("Failed to copy data to clipboard.");
    }
  };

  const handleView = (lawyer: ILeads) => {
    console.log(lawyer)
    setSelectedLead(lawyer); // Set the selected lawyer
    setIsModalOpen(true);      // Open the modal
};

 // Close the modal
 const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);   // Reset the selected lawyer
};

  // Confirm deletion action
  const confirmDelete = () => {
    if (leadToDelete) {
      deleteUserMutation.mutate(leadToDelete._id);
      setIsDeleteModalOpen(false); // Close the modal after deletion
    }
  };
  const columns = LeadsColumns(expandedRows, setExpandedRows, handleView, handleEdit, handleDelete, handleCopy);
  const totalPages = data ? Math.ceil(data.total / rowPerPage) : 1;

  return (
<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-max">
  {/* Header Section */}
  <div className="flex justify-between items-center">
    <h1 className="text-xl font-semibold md:text-2xl">Team</h1>
  </div>

  {/* Data Table Section */}
  <div className="flex items-center justify-center w-full">
    {!isLoading && data ? (
      <DataTable
        isDateFilter={false}
        FormComponent={AddLeadsForm}
        QueryKey=""
        API="/api/leads"
        filter="leads"
        data={data?.leads!}
        totalData={data?.total!}
        columns={columns}
        linkToAdd="/leads"
        refetch={refetch}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        totalPages={totalPages}
        currentPage={page}
        setPage={setPage}
        dataLoading={isLoading}
        setSearch={setSearch}
        search={search}
        rowPerPage={rowPerPage}
        setRowPerPage={setRowPerPage}
        total={data?.total!}
      />
    ) : (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-1 text-center">
        <Image
          src={noData}
          alt="no-Lawyers"
          width={500}
          height={500}
          className="m-6 rounded-lg"
        />
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">
          You have no Leads
        </h3>
        <p className="text-sm text-muted-foreground">
          You can view all Leads here as soon as you add one.
        </p>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="min-w-full sm:min-w-[80%] md:min-w-[60%] lg:min-w-[50%]">
          <DialogHeader>
            <DialogTitle>Add Lead</DialogTitle>
          </DialogHeader>
          <AddLeadsForm onClose={() => setIsAddModalOpen(false)} leadsId='' />
        </DialogContent>
      </Dialog>
      <button onClick={() => setIsAddModalOpen(true)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Lead
      </button>

      </div>
    )}
  </div>

  {/* Render the Lawyer Details Modal */}
  <LeadsDetailsModal
    handleView={handleCopy}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    handleCopy={handleCopy}
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    leads={selectedLead}
  />

  {/* Modal for Editing Lawyer */}
  {selectedLead && (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="min-w-full sm:min-w-[80%] md:min-w-[60%] lg:min-w-[50%]">
        <DialogHeader>
          <DialogTitle>Edit Lawyer</DialogTitle>
        </DialogHeader>
        <EditLeadForm
          leadsId={selectedLead._id}
          onClose={() => setIsEditModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )}

  {/* Custom Delete Confirmation Modal */}
  {leadToDelete && (
    <ConfirmDeleteModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={confirmDelete}
      itemName="Lead"
    />
  )}
</main>

  );
};

export default ViewLeadsPage;
