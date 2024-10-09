"use client"
import { AddTeamForm } from "@/components/forms/TeamForm";
// import { onAddSubmitTeam } from "@/functions/onAddSubmitTeam";
export default function AddTeamPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-[80%] bg-muted-foreground border-secondary border-dashed border-2 backdrop-blur-sm" style={{ boxShadow: 'rgba(128, 128, 128, 0.84) 0px 3px 8px' }}>
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4">Add Team</h2>
          <AddTeamForm />
        </div>
      </div>
    </div>
  );
}
