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

interface LawyersResponse {
    lawyers: ILawyer[];
    total: number;
  }
const ViewLawyerPage = () => {
    const [expandedRows, setExpandedRows] = useState({});
    const columns = LawyerColumns(expandedRows, setExpandedRows);
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
        placeholderData: (prev)=>prev, // Keep previous data to ensure seamless experience during fetch
        staleTime: 5000,
      });
console.log("lawyers",data)
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
  // Edit user handler
  const handleEdit = (id: string) => {
    router.push(`/lawyers/edit/${id}`);
  };
  // Delete user handler
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
          deleteUserMutation.mutate(id);
        } else {
            toast.error("you do not have permissions for deleting a user")
            return null
        }
    };

    const totalPages = data ? Math.ceil(data.total / rowPerPage) : 1;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-max">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Lawyers</h1>
    </div>
      <div className="flex items-center justify-center rounded-lg  ">
      {!isLoading ? (
              <DataTable
              FormComponent={AddLawyerForm}
              QueryKey='lawyers'
              API='/api/lawyers'
              filter='lawyer'
              data={data?.lawyers!}
              totalData={data?.total!}
              columns={columns}
              linkToAdd="/lawyers"
              // filters={roleOptions}
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
         <div className="flex flex-col items-center justify-center h-[80vh]  gap-1 text-center">
          <Image src={noData} alt="no-Lawyers" width={500} height={500} className="m-6 rounded-lg "/>
          <h3 className="text-2xl font-bold tracking-tight">
            You have no Users
          </h3>
          <p className="text-sm text-muted-foreground">
            You can view all Users here as soon as you add one.
          </p>
          <Link href={"/users/add"} className="mt-4">
            <Button>Add User</Button>
          </Link>
        </div>
      )}
    </div>
  </main>
  )
}

export default ViewLawyerPage
