"use server";

import { SessionValidation } from "@/lib/actions/session-validation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const DeleteFlowerCare = async (id: string) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.flower_care.delete({ where: { id } });
  return { message: "Cuidado deletado com sucesso!" };
};
