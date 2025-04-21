"use server";

import { prisma } from "@/lib/db/prisma";

export async function ListAllFlowerMeanings() {
  const list = await prisma.flower_meaning.findMany();

  return list;
}
