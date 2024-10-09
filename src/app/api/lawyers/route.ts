import { connectToDatabase } from '@/functions/connectDB';  // Ensure this points to the correct file path
import { Lawyer } from '@/models/lawyers.model';  // Import the Lawyer model
import { lawyerSchema } from '@/zod-schemas/zLawyer';
import { NextResponse } from 'next/server';
import { z } from 'zod';
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
