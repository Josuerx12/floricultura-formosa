import { z } from "zod";

export const CategorySchema = z.object({
  category: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
});
