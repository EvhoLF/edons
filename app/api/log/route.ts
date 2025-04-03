import { LogClear, LogCreate, LogGetAll } from "@/DB/services/LogService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const logs = await LogGetAll();
    return NextResponse.json(logs);
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLog = await LogCreate(body);
    return NextResponse.json(newLog, { status: 201 });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await LogClear(body?.days);
    return NextResponse.json(res);
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
