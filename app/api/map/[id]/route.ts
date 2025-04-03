import { LogActions, LogStatuses } from "@/DB/models/Log";
import { LogCreate } from "@/DB/services/LogService";
import { MapDelete, MapGetById, MapUpdate } from "@/DB/services/MapService";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET (получить карту по ID)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  let idMap = '';
  try {
    const { id } = await params;
    idMap = id;
    const map = await MapGetById(id);
    if (map) {
      return NextResponse.json(map);
    }
    else {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_GET, status: LogStatuses.ERROR, description: `Map not found, ${id}` });
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }
  } catch (error: any) {
    LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_GET, status: LogStatuses.ERROR, description: { error, message: `Map not found, ${idMap}` } });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (обновить карту по ID)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const updates = await req.json();
    const { id } = await params;
    const updatedMap = await MapUpdate(id, updates);
    if (updatedMap) {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_UPDATE, status: LogStatuses.SUCCESS, description: `MAP - ${id}` });
      return NextResponse.json(updatedMap)
    }
    else {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_UPDATE, status: LogStatuses.ERROR, description: 'Map not found' });
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }
  } catch (error: any) {
    LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_UPDATE, status: LogStatuses.ERROR, description: error });
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 400 }
    );
  }
}

// DELETE (удалить карту по ID)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const { id } = await params;
    const deletedMap = await MapDelete(id);
    if (deletedMap) {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_DELETE, status: LogStatuses.SUCCESS, description: `MAP - ${id}` });
      return NextResponse.json({ success: true })
    }
    else {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_DELETE, status: LogStatuses.SUCCESS, description: `MAP - ${id}` });
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }
  } catch (error: any) {
    const { id } = await params;
    LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_DELETE, status: LogStatuses.ERROR, description: { ...error, id: id ?? null } });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}