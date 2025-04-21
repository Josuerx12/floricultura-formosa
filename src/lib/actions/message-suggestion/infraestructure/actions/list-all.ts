import { prisma } from "@/lib/db/prisma";

export async function ListAllMessageSuggestions() {
  const messages = await prisma.message_suggestion.findMany();

  return messages;
}
