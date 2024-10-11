import { NextResponse } from 'next/server';
import { ITeam } from '@/interfaces/interface';
import { connectToDatabase } from '@/functions/connectDB';
import { Team } from '@/models/teams.model';

// **POST method (Create team)**
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { teamName, teamMembers }: ITeam = await req.json();

    // Validate input
    if (!teamName || typeof teamName !== 'string') {
      return NextResponse.json({ message: 'Invalid teamName' }, { status: 400 });
    }
    if (!teamMembers || !Array.isArray(teamMembers)) {
      return NextResponse.json({ message: 'Invalid teamMembers' }, { status: 400 });
    }

    // Create and save team
    const newTeam = new Team({
      teamName,
      teamMembers,
      createdAt: new Date(),
    });

    const savedTeam = await newTeam.save();
    return NextResponse.json(savedTeam, { status: 201 });
  } catch (error: any) {
    console.error('Error saving team:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// **GET method (Fetch all teams)**
export async function GET() {
    try {
      // Connect to MongoDB
      await connectToDatabase();

      // Fetch the list of Teams from the database
      const Teams = await Team.find();  // You can also apply filters or pagination here if necessary
      const TeamCount = Teams.length;

      // Return the list of Teams and count as JSON
      return new Response(JSON.stringify({ Teams, count: TeamCount }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching Teams:', error);
      return new Response(
        JSON.stringify({ message: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
