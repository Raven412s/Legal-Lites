import { ITeam } from "@/interfaces/interface";
import mongoose, { Schema, Document } from "mongoose";

// Extend the ITeam interface with Document
interface ITeamDocument extends ITeam, Document {}

// Team Schema
const TeamSchema = new Schema<ITeamDocument>({
  teamName: {
    type: String,
    required: true,
  },
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lawyer",
    },
  ],
});

export const Team = mongoose.model<ITeamDocument>("Team", TeamSchema);
