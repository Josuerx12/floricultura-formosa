"use server";

import { SessionValidation } from "@/lib/actions/session-validation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const DeleteFlowerMeaning = async (id: string) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.flower_meaning.delete({ where: { id } });
  return { message: "Significado deletado com sucesso!" };
};
