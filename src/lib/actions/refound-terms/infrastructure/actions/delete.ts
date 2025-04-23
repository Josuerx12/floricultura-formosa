"use server";

import { SessionValidation } from "@/lib/actions/session-validation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const DeleteRefoundTerms = async (id: string) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.refound_terms.delete({ where: { id } });
  return { message: "Termo de reembolso deletado com sucesso!" };
};
