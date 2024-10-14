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

interface LawyersResponse {
  lawyers: ILawyer[];
  total: number;
}

const ViewLawyerPage = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedLawyer, setSelectedLawyer] = useState<ILawyer | null>(null); // State to hold the selected lawyer for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage modal visibility

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
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
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

  // Delete user handler
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    } else {
      toast.error("You do not have permissions for deleting a user.");
      return null;
    }
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

  const handleView = (lawyer: ILawyer) => {
    setSelectedLawyer(lawyer); // Set the selected lawyer
    setIsModalOpen(true);      // Open the modal
};

 // Close the modal
 const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLawyer(null);   // Reset the selected lawyer
};

  const columns = LawyerColumns(expandedRows, setExpandedRows, handleView, handleEdit, handleDelete, handleCopy);
  const totalPages = data ? Math.ceil(data.total / rowPerPage) : 1;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-max">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Team</h1>
      </div>
      <div className="flex items-center justify-center rounded-lg">
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
            <Image src={noData} alt="no-Lawyers" width={500} height={500} className="m-6 rounded-lg" />
            <h3 className="text-2xl font-bold tracking-tight">You have no Users</h3>
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
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                lawyer={selectedLawyer}
            />

      {/* Modal for Editing Lawyer */}
      {selectedLawyer && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Lawyer</DialogTitle>
            </DialogHeader>
            <EditLawyerForm lawyerId={selectedLawyer._id} onClose={() => setIsEditModalOpen(false)}  />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default ViewLawyerPage;
