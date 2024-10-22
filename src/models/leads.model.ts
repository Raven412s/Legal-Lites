import { ILeads } from "@/interfaces/interface";
import mongoose, { Schema, Document } from "mongoose";

// Lead Schema
const LeadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  court: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  nextFollowUp: {
    type: Date,
    required: true,
  },
  caseType: {
    type: String,
    enum: ["Civil", "Matrimonial", "Criminal"],
    required: true,
  },
  leadSource: {
    type: String,
    enum: ["Walk-in", "Phone", "Social Media", "Referral", "Local Marketing", "Other"],
    required: true,
  },
  strong: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Fresh", "Open", "File Received", "Not Interested"],
    default: "Fresh",
    required: true,
  },
  comment: {
    type: String,  // Single comment as string
    default: "",  // Default to an empty string
  },
  followUpRecord: [
    {
      comment: {
        type: String,
        required: true,
      },
      nextFollowUp: {
        type: Date,
        required: true,
      },
    },
  ],  // Array of follow-up records
});

// Avoid re-compiling the model if it already exists
const Leads = mongoose.models.Leads || mongoose.model<ILeads & Document>("Leads", LeadSchema);

export { Leads };
