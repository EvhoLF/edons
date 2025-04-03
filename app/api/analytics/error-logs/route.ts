import { getErrorLogs } from "@/DB/services/AnalyticsService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getErrorLogs();
    return NextResponse.json(res);
  }
  catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}