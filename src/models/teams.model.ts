import { ITeam } from "@/interfaces/mongoose-models/teams";
import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema<ITeam>({
    teamName: {
      type: String,
      required: true,
    },
    teamMembers: [{
      type: Schema.Types.ObjectId,
      ref: "Lawyer",
    }],
  });

  export const Team = mongoose.model<ITeam & Document>("Team", TeamSchema);
