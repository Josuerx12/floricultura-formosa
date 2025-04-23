"use server";

import { prisma } from "@/lib/db/prisma";

export async function GetPrivacyTerms() {
  const privacyTerms = await prisma.privacity_terms.findFirst();

  return privacyTerms;
}
