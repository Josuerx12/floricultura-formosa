"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { CreateFlowerMeaningInput } from "./create";
import { SessionValidation } from "@/lib/actions/session-validation";

export const UpdateFlowerMeaning = async (
  id: string,
  data: Partial<CreateFlowerMeaningInput>
) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.flower_meaning.update({
    where: { id },
    data,
  });

  return { message: "Significado atualizado com sucesso!" };
};
