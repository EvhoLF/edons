import connectDB from "@/DB/connectDB";
import { User } from "@/DB/models/User";
import { UserGetAll, UserGetByEmail, UserGetByLogin } from "@/DB/services/UserService";
import { NextResponse } from "next/server";

// GET (получить всех пользователей)
export async function GET() {
  await connectDB();
  const users = await UserGetAll();
  return NextResponse.json(users);
}

// POST (создать нового пользователя)
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  if (body.login && await UserGetByLogin(body.login)) {
    return NextResponse.json({ error: "Email уже используется" }, { status: 400 });
  }
  if (body.email && await UserGetByEmail(body.email)) {
    return NextResponse.json({ error: "Login уже используется" }, { status: 400 });
  }

  const user = new User(body);
  await user.save();
  return NextResponse.json(user, { status: 201 });
}
