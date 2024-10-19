import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DetectPlant } from '@/app/_lib/openai/detectplant';

export async function POST(request) {
  let filePath = null;

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
    filePath = join(uploadDir, newFilename);
    await writeFile(filePath, buffer);
    let [plantName, score] = await DetectPlant(filePath);

    // Use parseInt if score is expected to be an integer
    score = parseInt(score, 10);
    console.log(score)
    console.log("Image uploaded successfully");

    // Return the fixed result of 2
    const response = NextResponse.json({ 
      success: true, 
      filePath: `/uploads/${newFilename}`,
      score,
      plantName
    }, { status: 200 });

    // Delete the file before returning the response
    await unlink(filePath);

    return response;
  } catch (error) {
    console.error("Error during image upload:", error);
    // Attempt to delete the file if it was created
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
    return NextResponse.json({ error: "Image upload and processing failed" }, { status: 500 });
  }
}