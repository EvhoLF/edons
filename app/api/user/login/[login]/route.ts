import { UserGetByLogin } from "@/DB/services/UserService";
import { NextResponse } from "next/server";

// GET (получить пользователя по login)
export async function GET(_: Request, { params }: { params: { login: string } }) {
  const { login } = await params;
  const user = await UserGetByLogin(login);
  return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 });
}