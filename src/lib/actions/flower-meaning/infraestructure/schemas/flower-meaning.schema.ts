import { z } from "zod";

export const FlowerMeaningSchema = z.object({
  name: z.string().min(1, "O nome da flor é obrigatório."),
  description: z.string().min(1, "A descrição do significado é obrigatória."),
});
