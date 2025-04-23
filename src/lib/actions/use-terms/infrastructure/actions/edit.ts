"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SessionValidation } from "@/lib/actions/session-validation";
import { CreateUseTermsInput } from "./create";

export const UpdateUseTerms = async ({
  data,
  id,
}: {
  id: string;
  data: Partial<CreateUseTermsInput>;
}) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.use_terms.update({
    where: { id },
    data,
  });

  return { message: "Termo de uso atualizado com sucesso!" };
};
