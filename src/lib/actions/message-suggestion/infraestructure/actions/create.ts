"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { MessageSuggestion } from "../../domain/message-suggestion.entity";
import { MessageSuggestionMapper } from "../mappers/message-suggestion.mapper";

export type CreateMessageSuggestionInput = {
  title: string;
  content: string;
};

export const CreateMessageSuggestion = async (
  data: CreateMessageSuggestionInput
) => {
  const session = await auth();
  const validator = new SessionValidation(session);
  validator.IsSellerOrAdmin();

  const entity = new MessageSuggestion(data);

  await prisma.message_suggestion.create({
    data: MessageSuggestionMapper.toModel(entity),
  });

  return { message: "Sugestão de mensagem criada com sucesso!" };
};
