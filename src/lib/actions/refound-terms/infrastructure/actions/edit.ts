"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SessionValidation } from "@/lib/actions/session-validation";
import { CreateRefoundTermsInput } from "./create";

export const UpdateRefoundTerms = async ({
  data,
  id,
}: {
  id: string;
  data: Partial<CreateRefoundTermsInput>;
}) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.refound_terms.update({
    where: { id },
    data,
  });

  return { message: "Termo de reembolso atualizado com sucesso!" };
};
