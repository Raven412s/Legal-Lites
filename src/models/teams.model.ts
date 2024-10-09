import { ITeam } from "@/interfaces/interface";
import mongoose, { Schema, Document } from "mongoose";

// Extend the ITeam interface with Document
interface ITeamDocument extends ITeam, Document {}

// Team Schema
const TeamSchema: Schema = new Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Avoid re-compiling the model if it already exists
const Team = mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);

export { Team };
