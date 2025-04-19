import { z } from "zod";

export const FlowerCareSchema = z.object({
  title: z.string().min(1, "O título do cuidado é obrigatório."),
  description: z.string().min(1, "A descrição do cuidado é obrigatória."),
});
