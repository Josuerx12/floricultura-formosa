"use server";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadFileAWS(file: File, type?: string) {
  const fileNameWithoutExt = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/\s+/g, "-");
  const fileKey = `${fileNameWithoutExt}.webp`;
  const bucket =
    type === "avatar"
      ? (process.env.AWS_AVATAR_BUCKET_NAME as string)
      : (process.env.AWS_PRODUCT_IMAGES_BUCKET_NAME as string);

  const fileBuffer = await file.arrayBuffer();

  const optimizedImage = await sharp(Buffer.from(fileBuffer))
    .resize({ width: 800 })
    .toFormat("webp", { quality: 80 })
    .toBuffer();

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: fileKey,
    Body: optimizedImage,
    ContentType: "image/webp",
    ACL: "public-read",
  });

  await s3.send(putObjectCommand);

  const url = `https://${bucket}.s3.amazonaws.com/${fileKey}`;

  return { url, fileKey, bucket };
}

export async function deleteFileAWS(key: string, bucket: string) {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3.send(deleteObjectCommand);
}
