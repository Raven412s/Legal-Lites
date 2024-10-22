import { connectToDatabase } from "@/functions/connectDB";
import { Leads } from "@/models/leads.model";
import { leadsSchema } from "@/zod-schemas/zLead";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
      // Parse the incoming JSON body
      const body = await req.json();

      // Validate the input using Zod schema
      const parsedData = leadsSchema.parse(body);

      // Connect to MongoDB
      await connectToDatabase();

      // Create a new lawyer using the validated data
      const newLead = await Leads.create(parsedData);

      // Return a success response with the newly created lawyer
      return NextResponse.json(newLead, { status: 201 });
    } catch (error) {
      console.error('Error creating lawyer:', error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return NextResponse.json({ message: 'Validation error', issues: error.issues }, { status: 400 });
      }

      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
