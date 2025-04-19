"use server";

import { SessionValidation } from "@/lib/actions/session-validation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const DeleteMessageSuggestion = async (id: string) => {
  const session = await auth();
  const validator = new SessionValidation(session);
  validator.IsSellerOrAdmin();

  const messageSuggestion = await prisma.message_suggestion.delete({
    where: { id },
  });

  if (!messageSuggestion) {
    throw new Error("Sugestões de mensagem não encontrada.");
  }

  return { message: "Sugestões de mensagem removida com sucesso!" };
};
