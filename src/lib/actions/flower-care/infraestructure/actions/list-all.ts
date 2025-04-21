import { prisma } from "@/lib/db/prisma";

export async function ListAllFlowerCares() {
  const flowerCares = await prisma.flower_care.findMany();

  return flowerCares;
}
