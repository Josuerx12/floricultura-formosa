"use server";

import { prisma } from "@/lib/db/prisma";

export async function GetUseTerms() {
  const useTerms = await prisma.use_terms.findFirst();

  return useTerms;
}
