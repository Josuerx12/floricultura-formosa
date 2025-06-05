import { z } from "zod";

export const SubCategorySchema = z.object({
  name: z.string({ message: "Nome da categoria deve ser informado!" }).min(3, {
    message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
  }),
  category_id: z.number({
    message:
      "Categoria não informada, selecione uma categoria para criar uma nova sub-categoria.",
  }),
  slug: z
    .string({ message: "Slug deve ser informado." })
    .min(2, "Slug deve conter pelo menos 2 caracteres."),
});
