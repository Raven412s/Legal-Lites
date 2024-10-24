import { connectToDatabase } from "@/functions/connectDB";
import { Leads } from "@/models/leads.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Create a URL object to access the search parameters
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || ""; // General search, which might include createdAt in mm/dd/yyyy format
    const role = url.searchParams.get("role") || "";
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "10";

    // Convert pagination query parameters
    const pageNum = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const skip = (pageNum - 1) * limit;

    // Build query object for searching and filtering
    const query: any = {};

    // Check if the search input matches a date format (mm/dd/yyyy)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(search)) {
      // If the search is in the format of mm/dd/yyyy, treat it as a createdAt search
      const [month, day, year] = search.split("/").map(Number);
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0); // Start of the day
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59); // End of the day

      query["createdAt"] = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else if (search) {
      // General search that matches any field
      query["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { court: { $regex: search, $options: "i" } },
        { caseType: { $regex: search, $options: "i" } },
        { leadSource: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    // Handle individual filters based on request query params
    const filters = {
      name: url.searchParams.get("name"),
      phone: url.searchParams.get("phone"),
      court: url.searchParams.get("court"),
      caseType: url.searchParams.get("caseType"),
      leadSource: url.searchParams.get("leadSource"),
      status: url.searchParams.get("status"),
      nextFollowUpStart: url.searchParams.get("nextFollowUpStart"),
      nextFollowUpEnd: url.searchParams.get("nextFollowUpEnd"),
      strong: url.searchParams.get("strong"),
    };

    // Apply specific filters if provided
    if (filters.name) query["name"] = { $regex: filters.name, $options: "i" };
    if (filters.phone) query["phone"] = { $regex: filters.phone, $options: "i" };
    if (filters.court) query["court"] = { $regex: filters.court, $options: "i" };
    if (filters.caseType) query["caseType"] = filters.caseType; // Exact match
    if (filters.leadSource) query["leadSource"] = filters.leadSource; // Exact match
    if (filters.status) query["status"] = filters.status; // Exact match
    if (filters.strong) query["strong"] = filters.strong === "true";

    // Filter by date range for nextFollowUp
    if (filters.nextFollowUpStart || filters.nextFollowUpEnd) {
      query["nextFollowUp"] = {};
      if (filters.nextFollowUpStart) {
        query["nextFollowUp"]["$gte"] = new Date(filters.nextFollowUpStart);
      }
      if (filters.nextFollowUpEnd) {
        query["nextFollowUp"]["$lte"] = new Date(filters.nextFollowUpEnd);
      }
    }

    // Execute the query with pagination
    const leads = await Leads.find(query).skip(skip).limit(limit);
    const total = await Leads.countDocuments(query); // Total count for pagination

    // Return leads, total count, and pagination info
    return NextResponse.json({
      success: true,
      leads,
      total,
      pageNum,
      pageSize: limit,
    });
  } catch (error: any) {
    // Handle any errors and return a 500 status
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
