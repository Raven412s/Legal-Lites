import { ILawyer } from "@/interfaces/mongoose-models/lawyers";
import mongoose, { Schema, Document } from "mongoose";

// Lawyer Schema
const LawyerSchema = new Schema({
  title: {
    type: String,
    enum: ["Adv.", "Mr.", "Mrs.", "Miss.", "Dr."],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  designation: {
    type: String,
    enum: ["Junior Counsel", "Senior Counsel", "Para-Legal", "Office Executive", "Other"],
    required: true,
  },
  bciRegistrationNo: {
    type: String,
    required: function () {
      return this.designation === "Junior Counsel" || this.designation === "Senior Counsel";
    },
    default: "NA",
  },
  verified: {
    type: Boolean,
    default: false, // To be updated once OTP is verified
  }
});

export const Lawyer = mongoose.model<ILawyer & Document>("Lawyer", LawyerSchema);