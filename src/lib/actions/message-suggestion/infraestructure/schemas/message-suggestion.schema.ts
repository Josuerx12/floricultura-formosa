import { z } from "zod";

export const MessageSuggestionSchema = z.object({
  title: z.string().min(1, "O título da sugestão de mensagem é obrigatório."),

  content: z
    .string()
    .min(1, "O conteúdo da sugestão de mensagem é obrigatório."),
});
