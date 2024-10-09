"use client"
import React from "react"
import { useQuery } from '@tanstack/react-query';
import { fetchTeams } from "@/functions/teams";


function TeamsList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching teams: {error.message}</p>;

  return (
    <div>
      {data.map((team: any) => (
          <ul key={team._id}>
            {team.teamName}
            {team.teamMembers}

        </ul>
      ))}
    </div>
  );
}

const ViewTeamPage = () => {
  return (
    <div className="text-slate-50">{TeamsList()}</div>
  )
}

export default ViewTeamPage
