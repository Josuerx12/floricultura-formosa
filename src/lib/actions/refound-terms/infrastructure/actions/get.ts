"use server";

import { prisma } from "@/lib/db/prisma";

export async function GetRefoundTerms() {
  const refoundTerms = await prisma.refound_terms.findFirst();

  return refoundTerms;
}
