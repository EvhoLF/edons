import { UserDelete, UserGetById, UserUpdate, UserValidation } from "@/DB/services/UserService";
import { NextResponse } from "next/server";

// GET (получить пользователя по ID)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const user = await UserGetById(id);
    return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

// PUT (обновить пользователя)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const { id } = await params;
    await UserValidation(updates, id);
    const user = await UserUpdate(id, updates);
    return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    return NextResponse.json(
      { errors: error?.validationErrors ?? { message: error?.message ?? "Something went wrong" } },
      { status: 400 }
    );
  }
}

// DELETE (удалить пользователя)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const deletedUser = await UserDelete(id);
    return deletedUser ? NextResponse.json({ success: true }) : NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
