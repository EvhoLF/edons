import { UserGetByEmail } from "@/DB/services/UserService";
import { NextResponse } from "next/server";

// GET (получить пользователя по email)
export async function GET(_: Request, { params }: { params: { email: string } }) {
  const { email } = await params;
  const user = await UserGetByEmail(email);
  return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 });
}