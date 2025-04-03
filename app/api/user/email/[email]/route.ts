import { LogActions, LogStatuses } from "@/DB/models/Log";
import { LogCreate } from "@/DB/services/LogService";
import { UserGetByEmail } from "@/DB/services/UserService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

// GET (получить пользователя по email)
export async function GET(_: Request, { params }: { params: { email: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const { email } = await params;
    const user = await UserGetByEmail(email);
    if (user) {
      return NextResponse.json(user);
    }
    else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    const { email } = await params;
    LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_GET, status: LogStatuses.ERROR, description: { error, EMAIL: email || null } });
    return NextResponse.json({ error }, { status: 404 });
  }
}