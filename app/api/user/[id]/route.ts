import { LogActions, LogStatuses } from "@/DB/models/Log";
import { LogCreate } from "@/DB/services/LogService";
import { UserDelete, UserGetById, UserUpdate, UserValidation } from "@/DB/services/UserService";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET (получить пользователя по ID)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const { id } = await params;
    const user = await UserGetById(id);
    return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  catch (error) {
    const { id } = await params;
    LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_GET, status: LogStatuses.ERROR, description: { error, ID: id } });
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

// PUT (обновить пользователя)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const updates = await req.json();
    const { id } = await params;
    await UserValidation(updates, id);
    const user = await UserUpdate(id, updates);
    if (user) {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_UPDATE, status: LogStatuses.SUCCESS, description: `ID - ${id}` });
      return NextResponse.json(user);
    }
    else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    const { id } = await params;
    LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_UPDATE, status: LogStatuses.ERROR, description: { error, ID: id } });
    return NextResponse.json(
      { errors: error?.validationErrors ?? { message: error?.message ?? "Something went wrong" } },
      { status: 400 }
    );
  }
}

// DELETE (удалить пользователя)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const { id } = await params;
    const deletedUser = await UserDelete(id);
    if (deletedUser) {
      LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_DELETE, status: LogStatuses.SUCCESS, description: `ID - ${id}` });
      return NextResponse.json({ success: true })
    }
    else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  }
  catch (error) {
    const { id } = await params;
    LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_DELETE, status: LogStatuses.ERROR, description: { error, ID: id } });
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
