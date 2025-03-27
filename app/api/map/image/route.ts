import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { MapUpdate } from '@/DB/services/MapService';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const mapId = formData.get("mapId") as string;
    const image = formData.get("image") as string;

    if (!mapId || !image) return NextResponse.json({ error: { image: 'Invalid data' } }, { status: 400 });

    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const fileName = `${mapId}.png`;
    const filePath = path.join(process.cwd(), "public", "uploads", "maps_screen", fileName);

    await writeFile(filePath, base64Data, 'base64');

    await MapUpdate(mapId, { image: `/uploads/maps_screen/${fileName}` });

    return NextResponse.json({ message: 'Screenshot uploaded', image: `/uploads/maps_screen/${fileName}` });
  } catch (error) {
    return NextResponse.json({ error: { message: 'Failed to upload screenshot map', error } }, { status: 500 });
  }
}
