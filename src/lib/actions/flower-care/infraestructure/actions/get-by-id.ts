"use server";

import { prisma } from "@/lib/db/prisma";
import { FlowerCareMapper } from "../mappers/flower-care.mapper";

export const GetFlowerCareById = async (id: string) => {
  const item = await prisma.flower_care.findUnique({ where: { id } });
  if (!item) throw new Error("Cuidado não encontrado.");
  return FlowerCareMapper.toPlainObject(item);
};
