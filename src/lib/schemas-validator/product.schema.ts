import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string({ message: "Nome do produto deve ser informado!" }).min(3, {
    message: "Nome do produto deve conter pelo menos 3 caracteres!",
  }),
  slug: z
    .string({ message: "Slug do produto deve ser informado!" })
    .min(3, {
      message: "Slug do produto deve conter pelo menos 3 caracteres!",
    })
    .refine((value) => value?.replaceAll(" ", "_")?.toLowerCase()),
  is_visible: z.boolean({
    message: "Informe se o produto vai ser visivel ou não.",
  }),
  priority: z.boolean({
    message: "Informe se o produto vai ser prioridade ou não.",
  }),
  subcategory_id: z.coerce
    .number({
      message:
        "Sub-categoria não informada, selecione uma sub-categoria para criar uma nova sub-categoria.",
    })
    .int({ message: "O id da sub-categoria informada não é valido." }),
  stock_quantity: z.coerce
    .number({ message: "Quantidade em estoque deve ser informado!" })
    .int({ message: "Quantidade em estoque deve ser um número inteiro!" }),
  description: z.string({
    message: "Descrição do produto deve ser informada!",
  }),
  price: z
    .string({ message: "Preço do produto deve ser informado!" })
    .refine((val) => /^[0-9]+(,[0-9]{1,2})?$/.test(val), {
      message: "O preço deve estar no formato válido (ex: '1000,50')",
    }),
});

export const EditProductSchema = z.object({
  name: z
    .string({ message: "Nome do produto deve ser informado!" })
    .min(3, {
      message: "Nome do produto deve conter pelo menos 3 caracteres!",
    })
    .optional(),
  slug: z
    .string({ message: "Nome do produto deve ser informado!" })
    .min(3, {
      message: "Nome do produto deve conter pelo menos 3 caracteres!",
    })
    .refine((value) => value.replaceAll(" ", "_")?.toLowerCase())
    .optional(),
  subcategory_id: z.coerce
    .number({
      message:
        "Sub-categoria não informada, selecione uma sub-categoria para criar uma nova sub-categoria.",
    })
    .int({ message: "O id da sub-categoria informada não é valido." })
    .optional(),
  stock_quantity: z.coerce
    .number({ message: "Quantidade em estoque deve ser informado!" })
    .int({ message: "Quantidade em estoque deve ser um número inteiro!" })
    .optional(),
  is_visible: z.boolean({
    message: "Informe se o produto vai ser visivel ou não.",
  }),
  priority: z.boolean({
    message: "Informe se o produto vai ser prioridade ou não.",
  }),
  description: z
    .string({
      message: "Descrição do produto deve ser informada!",
    })
    .optional(),
  price: z
    .string({ message: "Preço do produto deve ser informado!" })
    .refine((val) => /^[0-9]+(,[0-9]{1,2})?$/.test(val), {
      message: "O preço deve estar no formato válido (ex: '1000,50')",
    })
    .optional(),
});
