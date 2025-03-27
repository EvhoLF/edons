import { MapDelete, MapGetById, MapUpdate } from "@/DB/services/MapService";
import { NextResponse } from "next/server";

// GET (получить карту по ID)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const map = await MapGetById(id);
    return map
      ? NextResponse.json(map)
      : NextResponse.json({ error: "Map not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (обновить карту по ID)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const { id } = await params;
    const updatedMap = await MapUpdate(id, updates);
    return updatedMap
      ? NextResponse.json(updatedMap)
      : NextResponse.json({ error: "Map not found" }, { status: 404 });
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
    const deletedMap = await MapDelete(id);
    return deletedMap
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Map not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}