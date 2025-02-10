import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string({ message: "Nome do produto deve ser informado!" }).min(3, {
    message: "Nome do produto deve conter pelo menos 3 caracteres!",
  }),
  subcategory_id: z.number({
    message:
      "Sub-categoria não informada, selecione uma sub-categoria para criar uma nova sub-categoria.",
  }),
  description: z.string({
    message: "Descrição do produto deve ser informada!",
  }),
  stock_quantity: z
    .number({ message: "Quantidade em estoque deve ser informado!" })
    .int({
      message: "Quantidade em estoque deve ser um valor numerico inteiro!",
    }),
  price: z.number({ message: "Preço do produto deve ser informado!" }),
});
