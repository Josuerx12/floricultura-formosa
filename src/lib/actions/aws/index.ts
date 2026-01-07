import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({
  region: process.env.FLORICULTURA_AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.FLORICULTURA_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.FLORICULTURA_AWS_SECRET_ACCESS_KEY as string,
  },
});

export const fileTypes = {
  AVATAR: "avatar",
  BANNER: "banner",
  PRODUCT: "product",
} as const;

export type FileType = (typeof fileTypes)[keyof typeof fileTypes];

export async function uploadFileAWS(file: File, type?: string) {
  const fileNameWithoutExt =
    new Date().getTime() +
    file.name?.replace(/\.[^/.]+$/, "")?.replace(/\s+/g, "-");
  const fileKey = `${fileNameWithoutExt}.webp`;

  let bucket: string;

  switch (type) {
    case "avatar":
      bucket = process.env.FLORICULTURA_AWS_AVATAR_BUCKET_NAME as string;
    case "banner":
      bucket = process.env.FLORICULTURA_AWS_BANNER_IMAGES_BUCKET_NAME as string;
    default:
      bucket = process.env
        .FLORICULTURA_AWS_PRODUCT_IMAGES_BUCKET_NAME as string;
  }

  const fileBuffer = await file.arrayBuffer();

  const optimizedImage = await sharp(Buffer.from(fileBuffer))
    .resize({ width: type == "banner" ? 1920 : 800 })
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
