import { connectToDatabase } from "@/functions/connectDB";
import { Leads } from "@/models/leads.model";
import { leadsSchema } from "@/zod-schemas/zLead";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb'
import { z } from "zod";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params; // Extract the lawyer ID from the parameters

      // Parse the incoming JSON body
      const body = await req.json();

      // Validate the input using Zod schema
      const parsedData = leadsSchema.parse(body);

      // Connect to MongoDB
      await connectToDatabase();

      // Update the lawyer using the validated data
      const updatedLawyer = await Leads.findByIdAndUpdate(id, parsedData, { new: true });

      if (!updatedLawyer) {
        return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
      }

      // Return a success response with the updated lawyer
      return NextResponse.json(updatedLawyer, { status: 200 });
    } catch (error) {
      console.error('Error updating lead:', error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return NextResponse.json({ message: 'Validation error', issues: error.issues }, { status: 400 });
      }

      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

  export async function GET(request: NextRequest, context: any) {
    try {
      await connectToDatabase();
      const id = context.params.id;

      if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
      }

      const lead = await Leads.findById(new ObjectId(id));

      if (!lead) {
        return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: lead }, { status: 200 });
    } catch (error: any) {
      console.error(`Error fetching lead: ${error.message}`);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
