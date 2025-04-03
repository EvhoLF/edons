import connectDB from "@/DB/connectDB";
import { LogActions, LogStatuses } from "@/DB/models/Log";
import { User } from "@/DB/models/User";
import { LogCreate } from "@/DB/services/LogService";
import { UserGetAll, UserGetByEmail, UserGetByLogin } from "@/DB/services/UserService";
import { NextResponse } from "next/server";

// GET (получить всех пользователей)
export async function GET() {
  try {
    await connectDB();
    const users = await UserGetAll();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка" }, { status: 400 });
  }
}

// POST (создать нового пользователя)
export async function POST(req: Request) {
  try {
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

    LogCreate({ userId: null, action: LogActions.USER_SIGNUP, status: LogStatuses.SUCCESS, description: `USER - ${user.id}` });
    return NextResponse.json(user, { status: 201 });
  }
  catch (error) {
    LogCreate({ userId: null, action: LogActions.USER_SIGNUP, status: LogStatuses.ERROR, description: { message: 'Failed to signup', error } });
    return NextResponse.json({ error: { message: 'Failed to signup', error } }, { status: 500 });
  }
}
