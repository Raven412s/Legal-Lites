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
  await connectToDatabase();

  try {
    const teams = await Team.find(); // Fetch all teams from the database
    return NextResponse.json(teams, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
