import { connectToDatabase } from "@/functions/connectDB";
import { Lawyer } from "@/models/lawyers.model";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb'
import { lawyerSchema } from "@/zod-schemas/zLawyer";
import { z } from "zod";

// DELETE user by ID
export async function DELETE(request: NextRequest, context : any) {
    try {
      await connectToDatabase();
      const id = context.params.id

      if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
      }

      const deletedUser = await Lawyer.findByIdAndDelete(new ObjectId(id));

      if (!deletedUser) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error: any) {
      console.error(`Error deleting user: ${error.message}`);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  // GET lawyer by ID
export async function GET(request: NextRequest, context: any) {
    try {
      await connectToDatabase();
      const id = context.params.id;

      if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
      }

      const lawyer = await Lawyer.findById(new ObjectId(id));

      if (!lawyer) {
        return NextResponse.json({ success: false, message: 'Lawyer not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: lawyer }, { status: 200 });
    } catch (error: any) {
      console.error(`Error fetching lawyer: ${error.message}`);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract the lawyer ID from the parameters

    // Parse the incoming JSON body
    const body = await req.json();

    // Validate the input using Zod schema
    const parsedData = lawyerSchema.parse(body);

    // Connect to MongoDB
    await connectToDatabase();

    // Update the lawyer using the validated data
    const updatedLawyer = await Lawyer.findByIdAndUpdate(id, parsedData, { new: true });

    if (!updatedLawyer) {
      return NextResponse.json({ message: 'Lawyer not found' }, { status: 404 });
    }

    // Return a success response with the updated lawyer
    return NextResponse.json(updatedLawyer, { status: 200 });
  } catch (error) {
    console.error('Error updating lawyer:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
