"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function GetAllFlowerMeanings({
  page = 1,
  perPage = 10,
  search = "",
}: {
  page: number;
  perPage?: number;
  search?: string;
}) {
  const where: Prisma.flower_meaningWhereInput = {
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  const totalItems = await prisma.flower_meaning.count({ where });
  const totalPages = Math.ceil(totalItems / perPage);

  const list = await prisma.flower_meaning.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return {
    totalItems,
    totalPages,
    items: list.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
  };
}
