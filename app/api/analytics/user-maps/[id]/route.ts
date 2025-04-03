import { getUserMapStats } from "@/DB/services/AnalyticsService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const res = await getUserMapStats(id);
    return NextResponse.json(res);
  }
  catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}