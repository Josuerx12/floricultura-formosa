"use server";

import { prisma } from "@/lib/db/prisma";
import { MessageSuggestionMapper } from "../mappers/message-suggestion.mapper";

export const GetMessageSuggestionById = async (id: string) => {
  const item = await prisma.message_suggestion.findUnique({ where: { id } });
  if (!item) throw new Error("Sugestão não encontrada.");
  return MessageSuggestionMapper.toPlainObject(item);
};
