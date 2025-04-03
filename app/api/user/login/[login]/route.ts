import { LogActions, LogStatuses } from "@/DB/models/Log";
import { LogCreate } from "@/DB/services/LogService";
import { UserGetByLogin } from "@/DB/services/UserService";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET (получить пользователя по login)
export async function GET(_: Request, { params }: { params: { login: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const { login } = await params;
    const user = await UserGetByLogin(login);
    return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  catch (error) {
    const { login } = await params;
    LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_GET, status: LogStatuses.ERROR, description: { error, LOGIN: login ?? null } });
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

}