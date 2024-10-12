"use client"
import { DataTable } from '@/components/tables/DataTable'
import { Button } from '@/components/ui/button'
import { ITeam } from '@/interfaces/interface'
import noData from "@/public/images/no.png"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteByID } from '@/actions/deleteByID'
import { getAllTeams } from '@/actions/getAllTeams'
import { TeamColumns } from '@/columns/teamColumns'
import { toast } from 'sonner'
import { AddTeamForm } from '@/components/forms/TeamForm'

interface TeamsResponse {
    teams: ITeam[];
    total: number;
  }
const ViewTeamPage = () => {
    const [expandedRows, setExpandedRows] = useState({});
    const columns = TeamColumns(expandedRows, setExpandedRows);
    const queryClient = useQueryClient();
    const router = useRouter();
    // States for pagination, search, and filters
    const [page, setPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [designation, setDesignation] = useState("");

    const { data, isLoading, isError, error, refetch } = useQuery<TeamsResponse, Error>({
        queryKey: ["Teams", { page, rowPerPage, search, designation }],
        queryFn: () => getAllTeams({ page, pageSize: rowPerPage, search, designation }),
        placeholderData: (prev)=>prev, // Keep previous data to ensure seamless experience during fetch
        staleTime: 5000,
      });
console.log("Teams",data)
      const deleteUserMutation = useMutation({
        mutationFn: (id: string) => deleteByID(id, "teams"),
        onSuccess: () => {
          toast.success("team deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["Teams"] });
        },
        onError: (err: any) => {
          toast.error(`Error: ${err.message}`);
        },
      });
  // Edit team handler
  const handleEdit = (id: string) => {
    router.push(`/teams/edit/${id}`);
  };
  // Delete team handler
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this team?")) {
          deleteUserMutation.mutate(id);
        } else {
            toast.error("you do not have permissions for deleting a team")
            return null
        }
    };

    const totalPages = data ? Math.ceil(data.total / rowPerPage) : 1;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-max">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Teams</h1>
    </div>
      <div className="flex items-center justify-center rounded-lg  ">
      {!isLoading ? (
              <DataTable
              FormComponent={AddTeamForm}
              QueryKey='Teams'
              API='/api/teams'
              filter='teams'
              data={data?.teams!}
              totalData={data?.total!}
              columns={columns}
              linkToAdd="/teams"
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
          <Image src={noData} alt="no-Teams" width={500} height={500} className="m-6 rounded-lg "/>
          <h3 className="text-2xl font-bold tracking-tight">
            You have no teams
          </h3>
          <p className="text-sm text-muted-foreground">
            You can view all teams here as soon as you add one.
          </p>
          <Link href={"/teams/add"} className="mt-4">
            <Button>Add Team</Button>
          </Link>
        </div>
      )}
    </div>
  </main>
  )
}

export default ViewTeamPage
