"use server";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";

const gribLocation = process.env.GRIB_LOCATION || '/tmp'

export async function uploadGrib(formData: FormData) {
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await fs.writeFile(`${gribLocation}/${file.name}`, buffer);

  revalidatePath("/wind");
}