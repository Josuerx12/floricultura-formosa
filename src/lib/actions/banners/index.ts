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

export async function storeBanner(input: FormData) {
  const title = input.get("title") as string;
  const redirect_url = input.get("redirect_url") as string;
  const file = input.get("file") as File;

  if (!file) throw new Error("Arquivo não encontrado!");

  const fileData = await uploadFileAWS(file, fileTypes.BANNER);

  const entity = await prisma.banners.create({
    data: {
      bucket: fileData.bucket,
      file_key: fileData.fileKey,
      url: fileData.url,
      title,
      redirect_url,
      is_active: true,
    },
  });

  return entity;
}
