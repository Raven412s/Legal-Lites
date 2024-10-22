// app/api/leads/[id]/route.ts

import { connectToDatabase } from "@/functions/connectDB";
import { Leads } from "@/models/leads.model";
import { leadsSchema } from "@/zod-schemas/zLead";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { z } from "zod";

// PATCH method to partially update a lead
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract the lead ID from the parameters

    // Parse the incoming JSON body
    const body = await req.json();

    // Validate the input using Zod schema for partial updates
    const parsedData = leadsSchema.partial().parse(body); // Use `.partial()` for optional fields

    // Connect to MongoDB
    await connectToDatabase();

    // Update the lead using the validated data
    const updatedLead = await Leads.findByIdAndUpdate(id, parsedData, { new: true });

    // Check if the lead was found and updated
    if (!updatedLead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    // Return a success response with the updated lead
    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error('Error updating lead:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT method to update a lead
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract the lead ID from the parameters

    // Parse the incoming JSON body
    const body = await req.json();

    // Validate the input using Zod schema
    const parsedData = leadsSchema.parse(body);

    // Connect to MongoDB
    await connectToDatabase();

    // Update the lead using the validated data
    const updatedLead = await Leads.findByIdAndUpdate(id, parsedData, { new: true });

    // Check if the lead was found and updated
    if (!updatedLead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    // Return a success response with the updated lead
    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error('Error updating lead:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET method to fetch a lead by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params; // Get the lead ID from parameters

    // Validate ID presence
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    // Fetch the lead by ID
    const lead = await Leads.findById(new ObjectId(id));

    // Check if the lead was found
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    // Return the lead data
    return NextResponse.json({ success: true, data: lead }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching lead: ${error.message}`);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context : any) {
    try {
      await connectToDatabase();
      const id = context.params.id

      if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
      }

      const deletedUser = await Leads.findByIdAndDelete(new ObjectId(id));

      if (!deletedUser) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error: any) {
      console.error(`Error deleting user: ${error.message}`);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
