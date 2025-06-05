import { z } from "zod";

export const CategorySchema = z.object({
  category: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
  slug: z
    .string({ message: "Slug deve ser informado." })
    .min(2, "Slug deve conter pelo menos 2 caracteres."),
});
