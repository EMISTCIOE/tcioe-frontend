import { NextRequest, NextResponse } from "next/server";
import { CampusReportsService } from "@/lib/api/campus-reports";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const search = searchParams.get("search") || undefined;
    const reportType = (searchParams.get("reportType") as any) || undefined;

    const response = await CampusReportsService.getCampusReports({
      page,
      limit,
      search,
      reportType,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Campus Reports API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch campus reports",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
