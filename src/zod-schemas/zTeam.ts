import { z } from "zod";
import { ILawyer } from "@/interfaces/interface";

// Adjust the schema to expect ILawyer[] for teamMembers
export const teamSchema = z.object({
  teamName: z.string(),
  teamMembers: z.array(z.object({
    _id: z.string(),
    name: z.string(),
  })),
  createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      const parsedDate = new Date(val);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
      }
      return parsedDate;
    }
    return val;
  }).default(() => new Date()),
});
