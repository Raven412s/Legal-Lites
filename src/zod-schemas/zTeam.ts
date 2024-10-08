import { z } from "zod";

// Team Zod Schema
const teamSchema = z.object({
    teamName: z.string().min(1, "Team Name is required"),
    teamMembers: z.array(z.string()).min(1, "At least one team member is required"),
  });

  export { teamSchema };
