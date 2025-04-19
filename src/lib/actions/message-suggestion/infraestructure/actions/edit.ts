"use server";

import { SessionValidation } from "@/lib/actions/session-validation";
import { CreateMessageSuggestionInput } from "./create";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const UpdateMessageSuggestion = async (
  id: string,
  data: Partial<CreateMessageSuggestionInput>
) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  await prisma.message_suggestion.update({
    where: { id },
    data,
  });

  return { message: "Sugestão atualizada com sucesso!" };
};
