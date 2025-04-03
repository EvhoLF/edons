import { LogDelete, LogGetByUser } from "@/DB/services/LogService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const log = await LogGetByUser(id);
    return log ? NextResponse.json(log) : NextResponse.json({ error: "Log not found" }, { status: 404 });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const deletedLog = await LogDelete(id);
    return deletedLog ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Log not found" }, { status: 404 });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
