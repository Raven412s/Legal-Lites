import { connectToDatabase } from '@/functions/connectDB';  // Ensure this points to the correct file path
import { Lawyer } from '@/models/lawyers.model';  // Import the Lawyer model
import { lawyerSchema } from '@/zod-schemas/zLawyer';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
// Handler for the GET request to fetch the list of lawyers
export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Fetch the list of lawyers from the database
    const lawyers = await Lawyer.find();  // You can also apply filters or pagination here if necessary

    // Return the list of lawyers as JSON
    return new Response(JSON.stringify(lawyers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handler for the POST request to create a new lawyer
export async function POST(req: Request) {
    try {
      // Parse the incoming JSON body
      const body = await req.json();

      // Validate the input using Zod schema
      const parsedData = lawyerSchema.parse(body);

      // Connect to MongoDB
      await connectToDatabase();

      // Create a new lawyer using the validated data
      const newLawyer = await Lawyer.create(parsedData);

      // Return a success response with the newly created lawyer
      return NextResponse.json(newLawyer, { status: 201 });
    } catch (error) {
      console.error('Error creating lawyer:', error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return NextResponse.json({ message: 'Validation error', issues: error.issues }, { status: 400 });
      }

      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

  export async function DELETE(request: Request) {
    try {
      await connectToDatabase();
      const { ids } = await request.json(); // Fetching `ids` from the request body

      if (!ids || ids.length === 0) {
        return NextResponse.json({ success: false, message: 'ID or IDs are required' }, { status: 400 });
      }

      // Handle single or multiple IDs
      if (Array.isArray(ids)) {
        // If it's an array, delete multiple users
        const objectIds = ids.map((id) => new ObjectId(id));
        const result = await Lawyer.deleteMany({ _id: { $in: objectIds } });

        if (result.deletedCount === 0) {
          return NextResponse.json({ success: false, message: 'No users found to delete' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: `${result.deletedCount} users deleted successfully` }, { status: 200 });
      } else {
        // If it's a single id, delete one user
        const deletedUser = await Lawyer.findByIdAndDelete(new ObjectId(ids));

        if (!deletedUser) {
          return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
      }
    } catch (error: any) {
      console.error(`Error deleting user(s): ${error.message}`);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
