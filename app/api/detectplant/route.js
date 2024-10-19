import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: "No image file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = uuidv4();
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const fileExtension = '.' + file.name.split('.').pop();
    const newFilename = `${id}${fileExtension}`;
    const filePath = join(uploadDir, newFilename);

    await writeFile(filePath, buffer);

    console.log("Image uploaded successfully");

    // Return the fixed result of 2
    return NextResponse.json({ 
      success: true, 
      filePath: `/uploads/${newFilename}`,
      result: 2,
      plantName: "Unknown Poisonous Plant"
    }, { status: 200 });
  } catch (error) {
    console.error("Error during image upload:", error);
    return NextResponse.json({ error: "Image upload and processing failed" }, { status: 500 });
  }
}