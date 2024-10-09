import { z } from "zod";
import { ILawyer } from "@/interfaces/interface";

// Adjust the schema to expect ILawyer[] for teamMembers
export const teamSchema = z.object({
  teamName: z.string(),
  teamMembers: z.array(z.object({
    _id: z.string(),
    name: z.string(),

  })),
});
