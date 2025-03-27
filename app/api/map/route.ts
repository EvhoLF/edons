import connectDB from "@/DB/connectDB";
import { MapGetAll, MapCreate } from "@/DB/services/MapService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const maps = await MapGetAll(userId || undefined);
  return NextResponse.json(maps);
}

// POST (создать новую карту)
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const map = await MapCreate(body);
  return NextResponse.json(map, { status: 201 });
}