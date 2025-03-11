"use server";
import { fileTypes, uploadFileAWS } from "../aws";
import { prisma } from "@/lib/db/prisma";

export async function getBanners() {
  const activeBanners = await prisma.banners.findMany({
    where: {
      is_active: true,
    },
  });

  return activeBanners ?? null;
}

export type PaginationInputProps = {
  page_size: number;
  page: number;
  search: string;
};

export async function getBannersWithPagination() {}

export async function storeBanner(input: { title: string; file: File }) {
  const fileData = await uploadFileAWS(input.file, fileTypes.BANNER);

  const entity = await prisma.banners.create({
    data: {
      bucket: fileData.bucket,
      file_key: fileData.fileKey,
      url: fileData.url,
      title: input.title,
      is_active: true,
    },
  });

  return entity;
}
