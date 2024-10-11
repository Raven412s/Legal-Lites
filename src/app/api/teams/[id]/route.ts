import { connectToDatabase } from "@/functions/connectDB";
import { Team } from "@/models/teams.model";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// DELETE user by ID
export async function DELETE(request: NextRequest, context : any) {
    try {
      await connectToDatabase();
      const id = context.params.id

      if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
      }

      const deletedUser = await Team.findByIdAndDelete(new ObjectId(id));

      if (!deletedUser) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error: any) {
      console.error(`Error deleting user: ${error.message}`);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
