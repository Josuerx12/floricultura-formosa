"use server";
import { dataTagErrorSymbol } from "@tanstack/react-query";
import { deleteFileAWS, fileTypes, uploadFileAWS } from "../aws";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Prisma, UserRoles } from "@prisma/client";

export type Banner = {
  id: number;
  title: string;
  url: string;
  redirect_url: string;
  file_key: string;
  bucket: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

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

export async function deleteBanner({ id }: { id: number }) {
  const exists = await prisma.banners.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!exists) {
    throw new Error("Banner com o id informado não encontrado.");
  }

  await prisma.banners.delete({
    where: {
      id,
    },
  });

  return {
    message: "Banner deletado com sucesso!",
  };
}

export async function editBanner(data: FormData) {
  const id = Number(data.get("id")) || 0;
  const title = data.get("title") as string;
  const redirect_url = data.get("redirect_url") as string;
  const isActive = data.get("isActive") as string;
  const file = data.get("file") as File | null | undefined;

  const session = await auth();

  if (!session) {
    throw new Error(
      "Você deve estar logado para realizar essa ação, recarregue a pagina e tente novamente."
    );
  }

  if (session.user.role != UserRoles.ADMIN) {
    throw new Error("Só administradores podem realizar essa ação.");
  }

  const banner = await prisma.banners.findUnique({
    where: {
      id,
    },
  });

  if (!banner) {
    throw new Error("Banner com o id informado não foi encontrado.");
  }

  if (file && banner.file_key) {
    await deleteFileAWS(banner.file_key, banner.bucket);

    const fileData = await uploadFileAWS(file, fileTypes.BANNER);

    banner.file_key = fileData.fileKey;
    banner.bucket = fileData.bucket;
    banner.url = fileData.url;
  }

  if (typeof isActive == "boolean") {
    banner.is_active = isActive;
  }

  if (title && title.length > 1) {
    banner.title = title;
  }

  if (redirect_url && redirect_url.length > 1) {
    banner.redirect_url = redirect_url;
  }

  await prisma.banners.update({
    where: {
      id: banner.id,
    },
    data: banner,
  });

  return {
    message: "Banner atualizado com sucesso!",
  };
}

export async function findAllBannersWithPagination({
  search,
  page,
  perPage = 10,
}: {
  search: string;
  page: number;
  perPage?: number;
}) {
  const where: Prisma.bannersWhereInput = {
    OR: [
      {
        title: {
          contains: search ?? "",
        },
      },
      !isNaN(Number(search))
        ? {
            id: Number(search),
          }
        : {},
    ],
  };

  const totalBanners = await prisma.banners.count({
    where,
  });

  const totalPages = Math.ceil(totalBanners / perPage);

  const banners = await prisma.banners.findMany({
    where,
    take: perPage ?? 10,
    skip: (page - 1) * perPage,
    orderBy: {
      is_active: "desc",
    },
  });

  return {
    banners,
    totalPages,
  };
}
