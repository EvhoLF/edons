import connectDB from "@/DB/connectDB";
import { CodeDataCreate } from "@/DB/services/CodeDataService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const map = await CodeDataCreate(body);
  return NextResponse.json(map, { status: 201 });
}