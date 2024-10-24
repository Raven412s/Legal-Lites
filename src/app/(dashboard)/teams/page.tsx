"use client"
import { DataTable } from '@/components/tables/DataTable'
import { Button } from '@/components/ui/button'
import { ILawyer } from '@/interfaces/interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import noData from "@/public/images/no.png";
import { getAllLawyers } from '@/actions/getAllLawyers'
import { LawyerColumns } from '@/columns/lawyerColumns'
import { toast } from 'sonner'
import { deleteByID } from '@/actions/deleteByID'
import { AddLawyerForm } from '@/components/forms/Lawyer/AddLawyerForm'
import { EditLawyerForm } from '@/components/forms/Lawyer/EditLawyerForm' // Import the Edit Lawyer form
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // For modal
import { LawyerDetailsModal } from '@/components/modals/LawyerDetailsModal'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'

interface LawyersResponse {
  lawyers: ILawyer[];
  total: number;
}

const ViewLawyerPage = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedLawyer, setSelectedLawyer] = useState<ILawyer | null>(null); // State to hold the selected lawyer for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [lawyerToDelete, setLawyerToDelete] = useState<ILawyer | null>(null); // Track the lawyer to delete

  const queryClient = useQueryClient();
  const router = useRouter();

  // States for pagination, search, and filters
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery<LawyersResponse, Error>({
    queryKey: ["lawyers", { page, rowPerPage, search, designation }],
    queryFn: () => getAllLawyers({ page, pageSize: rowPerPage, search, designation }),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteByID(id, "lawyers"),
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["lawyers"] })
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  // Edit user handler to open modal
  const handleEdit = (lawyer: ILawyer) => {
    setSelectedLawyer(lawyer); // Set the selected lawyer to the one being edited
    setIsEditModalOpen(true); // Open the modal
  };

 // Handler to open the delete modal
 const handleDelete = (lawyer: ILawyer) => {
    setLawyerToDelete(lawyer); // Set the selected lawyer to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleCopy = () => {
  };

  const handleView = (lawyer: ILawyer) => {
    console.log(lawyer)
    setSelectedLawyer(lawyer); // Set the selected lawyer
    setIsModalOpen(true);      // Open the modal
};

 // Close the modal
 const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLawyer(null);   // Reset the selected lawyer
};

  // Confirm deletion action
  const confirmDelete = () => {
    if (lawyerToDelete) {
      deleteUserMutation.mutate(lawyerToDelete._id);
      setIsDeleteModalOpen(false); // Close the modal after deletion
    }
  };

  const columns = LawyerColumns(expandedRows, setExpandedRows, handleView, handleEdit, handleDelete, handleCopy);
  const totalPages = data ? Math.ceil(data.total / rowPerPage) : 1;

  return (
<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-max">
  {/* Header Section */}
  <div className="flex justify-between items-center">
    <h1 className="text-xl font-semibold md:text-2xl">Team</h1>
  </div>

  {/* Data Table Section */}
  <div className="flex items-center justify-center w-full">
    {!isLoading ? (
      <DataTable
        isDateFilter={false}
        FormComponent={AddLawyerForm}
        QueryKey="lawyers"
        API="/api/lawyers"
        filter="lawyer"
        data={data?.lawyers!}
        totalData={data?.total!}
        columns={columns}
        linkToAdd="/lawyers"
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
          You have no Users
        </h3>
        <p className="text-sm text-muted-foreground">
          You can view all Users here as soon as you add one.
        </p>
        <Link href="/users/add" className="mt-4">
          <Button>Add User</Button>
        </Link>
      </div>
    )}
  </div>

  {/* Render the Lawyer Details Modal */}
  <LawyerDetailsModal
    handleView={handleCopy}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    handleCopy={handleCopy}
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    lawyer={selectedLawyer}
  />

  {/* Modal for Editing Lawyer */}
  {selectedLawyer && (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="min-w-full sm:min-w-[80%] md:min-w-[60%] lg:min-w-[50%]">
        <DialogHeader>
          <DialogTitle>Edit Lawyer</DialogTitle>
        </DialogHeader>
        <EditLawyerForm
          lawyerId={selectedLawyer._id}
          onClose={() => setIsEditModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )}

  {/* Custom Delete Confirmation Modal */}
  {lawyerToDelete && (
    <ConfirmDeleteModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={confirmDelete}
      itemName="Lawyer"
    />
  )}
</main>

  );
};

export default ViewLawyerPage;
