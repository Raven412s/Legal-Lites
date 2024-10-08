"use client"
import { AddTeamForm } from "@/components/forms/TeamForm";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-white  shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4">Add Team</h2>
          <AddTeamForm />
        </div>
      </div>
    </div>
  );
}
