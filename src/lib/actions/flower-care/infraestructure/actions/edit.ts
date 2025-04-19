"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SessionValidation } from "@/lib/actions/session-validation";
import { CreateFlowerCareInput } from "./create";

export const UpdateFlowerCare = async (
  id: string,
  data: Partial<CreateFlowerCareInput>
) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.flower_care.update({
    where: { id },
    data,
  });

  return { message: "Cuidado atualizado com sucesso!" };
};
