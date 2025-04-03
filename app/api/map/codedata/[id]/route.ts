import { CodeDataDelete, CodeDataGetById, CodeDataUpdate } from "@/DB/services/CodeDataService";
import { NextResponse } from "next/server";

// GET (получить карту по ID)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const map = await CodeDataGetById(id);
    return map
      ? NextResponse.json(map)
      : NextResponse.json({ error: "CodeData not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (обновить карту по ID)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const { id } = await params;
    const updatedCodeData = await CodeDataUpdate(id, updates);
    return updatedCodeData
      ? NextResponse.json(updatedCodeData)
      : NextResponse.json({ error: "CodeData not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 400 }
    );
  }
}

// DELETE (удалить карту по ID)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const deletedMap = await CodeDataDelete(id);
    return deletedMap
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "CodeData not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}