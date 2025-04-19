"use server";

import { prisma } from "@/lib/db/prisma";
import { FlowerMeaningMapper } from "../mappers/flower-meaning.mapper";

export const GetFlowerMeaningById = async (id: string) => {
  const item = await prisma.flower_meaning.findUnique({ where: { id } });
  if (!item) throw new Error("Significado não encontrado.");
  return FlowerMeaningMapper.toPlainObject(item);
};
