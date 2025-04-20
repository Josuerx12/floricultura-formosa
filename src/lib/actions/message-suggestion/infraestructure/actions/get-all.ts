"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function GetAllMessageSuggestions({
  page = 1,
  perPage = 10,
  search = "",
}: {
  page: number;
  perPage?: number;
  search?: string;
}) {
  const where: Prisma.message_suggestionWhereInput = {
    OR: [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  const totalItems = await prisma.message_suggestion.count({ where });
  const totalPages = Math.ceil(totalItems / perPage);

  const list = await prisma.message_suggestion.findMany({
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
      title: item.title,
      content: item.content,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
  };
}
