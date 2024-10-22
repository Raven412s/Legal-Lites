import { connectToDatabase } from "@/functions/connectDB";
import { Lawyer } from "@/models/lawyers.model";
import { Leads } from "@/models/leads.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
      await connectToDatabase();

      // Create a URL object to access the search parameters
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || ""; // Default to empty string if not present
      const role = url.searchParams.get('role') || ""; // Default to empty string if not present
      const page = url.searchParams.get('page') || "1"; // Default to "1" if not present
      const pageSize = url.searchParams.get('pageSize') || "10"; // Default to "10" if not present

      // Convert pagination query parameters
      const pageNum = parseInt(page, 10) || 1;
      const limit = parseInt(pageSize, 10) || 10;
      const skip = (pageNum - 1) * limit;

      // Build query object for searching and filtering
      const query: any = {};

      // If there is a search term, filter by name or email
      if (search) {
        query["$or"] = [
          { name: { $regex: search, $options: "i" } },
          { court: { $regex: search, $options: "i" } },
          { caseType: { $regex: search, $options: "i" } },
          { leadSource: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      // If a role is provided, filter by role
      if (role) {
        query["role"] = role;
      }

      // Execute the query with pagination
      const leads = await Leads.find(query).skip(skip).limit(limit);
      const total = await Leads.countDocuments(query); // Total count for pagination

      // Return lawyers, total count, and pagination info
      return NextResponse.json({
        success: true,
        leads,
        total,
        pageNum,
        pageSize: limit
      });

    } catch (error: any) {
      // Handle any errors and return a 500 status
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
