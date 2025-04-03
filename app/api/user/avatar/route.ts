import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { UserUpdate } from '@/DB/services/UserService';
import { LogActions, LogStatuses } from '@/DB/models/Log';
import { LogCreate } from '@/DB/services/LogService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 1MB

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const avatarFile = formData.get("avatarFile") as File;

    if (!avatarFile || !userId) {
      return NextResponse.json({ error: { image: 'Invalid data' } }, { status: 400 });
    }

    if (avatarFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ errors: { image: 'File size exceeds 5MB' } }, { status: 400 });
    }

    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${userId}-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'avatars', filename);
    await writeFile(filepath, buffer);
    UserUpdate(userId, { image: `/uploads/avatars/${filename}` })
    return NextResponse.json({ message: 'Avatar uploaded', image: `/uploads/avatars/${filename}` });
  } catch (error) {
    LogCreate({ userId: session?.user?.id || null, action: LogActions.USER_UPDATE, status: LogStatuses.ERROR, description: { message: 'Failed to upload avatar', error } });
    return NextResponse.json({ error: { image: 'Failed to upload avatar' } }, { status: 500 });
  }
}
