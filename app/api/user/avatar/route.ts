import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { UserUpdate } from '@/DB/services/UserService';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const avatarFile = formData.get("avatarFile") as File;

    if (!avatarFile || !userId) {
      return NextResponse.json({ error: { image: 'Invalid data' } }, { status: 400 });
    }

    // Проверяем размер файла
    if (avatarFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ errors: { image: 'File size exceeds 5MB' } }, { status: 400 });
    }

    // Читаем файл
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${userId}-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'avatars', filename);

    // Сохраняем файл в /public/uploads
    await writeFile(filepath, buffer);

    // Обновляем пользователя в БД
    UserUpdate(userId, { image: `/uploads/avatars/${filename}` })

    return NextResponse.json({ message: 'Avatar uploaded', image: `/uploads/avatars/${filename}` });
  } catch {
    return NextResponse.json({ error: { image: 'Failed to upload avatar' } }, { status: 500 });
  }
}
