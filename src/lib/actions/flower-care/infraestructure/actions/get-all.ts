"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function GetAllFlowerCares({
  page = 1,
  perPage = 10,
  search = "",
}: {
  page: number;
  perPage?: number;
  search?: string;
}) {
  const where: Prisma.flower_careWhereInput = {
    OR: [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  const totalItems = await prisma.flower_care.count({ where });
  const totalPages = Math.ceil(totalItems / perPage);

  const list = await prisma.flower_care.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return {
    totalItems,
    totalPages,
    flowerCares: list.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
  };
}
