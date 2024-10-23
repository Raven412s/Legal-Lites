import { z } from "zod";

// Schema for individual follow-up records
export const followUpRecordSchema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }), // Required string for comment
  nextFollowUp: z.union([z.string(), z.date()])  // Date can be string or Date object
    .transform((val) => {
      if (typeof val === "string") {
        const parsedDate = new Date(val);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format. Expected YYYY-MM-DD.");
        }
        return parsedDate;
      }
      return val;
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Invalid date" }), // Ensure the parsed date is valid
});

// Zod schema for the Leads model
export const leadsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }), // Required string
  court: z.string().min(1, { message: "Court is required" }), // Required string
  phone: z.string().min(1, { message: "Phone is required" }), // Required string
  nextFollowUp: z.union([z.string(), z.date()]) // Date as string or Date object
    .transform((val) => {
      if (typeof val === "string") {
        const parsedDate = new Date(val);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format. Expected YYYY-MM-DD.");
        }
        return parsedDate;
      }
      return val;
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Invalid date" }), // Ensure the parsed date is valid
  caseType: z.enum(["Civil", "Matrimonial", "Criminal"], {
    required_error: "Case Type is required",
  }), // Enum with required case types
  leadSource: z.enum(
    ["Walk-in", "Phone", "Social Media", "Referral", "Local Marketing", "Other"],
    { required_error: "Lead Source is required" }
  ), // Enum with required lead sources
  strong: z.boolean().optional().default(false), // Optional boolean with default value of false
  createdAt: z.union([z.string(), z.date()]) // Date as string or Date object
    .transform((val) => {
      if (typeof val === "string") {
        const parsedDate = new Date(val);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format. Expected YYYY-MM-DD.");
        }
        return parsedDate;
      }
      return val;
    })
    .default(() => new Date()), // Date with default value of current date
  status: z.enum(["Fresh", "Open", "File Received", "Not Interested"], {
    required_error: "Status is required",
  }).default("Fresh"), // Enum with default value of Fresh
  comment: z.string().optional().default(''), // Optional string for comment with default empty string
  followUpRecord: z.array(followUpRecordSchema).optional().default([]), // Array of follow-up records with default empty array
});

// Infer TypeScript type from the Zod schema
export type ILeads = z.infer<typeof leadsSchema>;
