"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SessionValidation } from "@/lib/actions/session-validation";
import { CreatePrivacyTermsInput } from "./create";

export const UpdatePrivacyTerms = async ({
  data,
  id,
}: {
  id: string;
  data: Partial<CreatePrivacyTermsInput>;
}) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.privacity_terms.update({
    where: { id },
    data,
  });

  return { message: "Termo de privacidade atualizado com sucesso!" };
};
