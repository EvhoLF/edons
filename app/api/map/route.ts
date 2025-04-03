import connectDB from "@/DB/connectDB";
import { LogActions, LogStatuses } from "@/DB/models/Log";
import { LogCreate } from "@/DB/services/LogService";
import { MapGetAll, MapCreate } from "@/DB/services/MapService";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const maps = await MapGetAll(userId || undefined);
    return NextResponse.json(maps);
  }
  catch (error) {
    LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_GET, status: LogStatuses.ERROR, description: error });
    return NextResponse.json({ error: error?.message ?? error }, { status: 404 });
  }
}

// POST (создать новую карту)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    await connectDB();
    const body = await req.json();
    if (body?.userId) {
      const map = await MapCreate(body);
      LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_CREATE, status: LogStatuses.SUCCESS, description: `Label: ${body?.label}` });
      return NextResponse.json(map, { status: 201 });
    }
    else {
      return NextResponse.json({ error: 'Ошибка создания карты' }, { status: 404 });
    }
  }
  catch (error) {
    LogCreate({ userId: session?.user?.id || null, action: LogActions.MAP_CREATE, status: LogStatuses.ERROR, description: error });
    return NextResponse.json({ error: error?.message ?? error }, { status: 404 });
  }
}