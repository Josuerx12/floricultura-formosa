import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string({ message: "Nome do produto deve ser informado!" }).min(3, {
    message: "Nome do produto deve conter pelo menos 3 caracteres!",
  }),
  subcategory_id: z
    .string({
      message:
        "Sub-categoria não informada, selecione uma sub-categoria para criar uma nova sub-categoria.",
    })
    .regex(/^\d+$/, { message: "Sub-categoria deve ser um número válido!" }) // Permite apenas números inteiros
    .transform((val) => parseInt(val, 10)),
  description: z.string({
    message: "Descrição do produto deve ser informada!",
  }),
  stock_quantity: z
    .string({ message: "Quantidade em estoque deve ser informado!" })
    .regex(/^\d+$/, {
      message: "Quantidade em estoque deve ser um número inteiro!",
    })
    .transform((val) => parseInt(val, 10)),
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
  subcategory_id: z
    .string({
      message:
        "Sub-categoria não informada, selecione uma sub-categoria para criar uma nova sub-categoria.",
    })
    .regex(/^\d+$/, { message: "Sub-categoria deve ser um número válido!" }) // Permite apenas números inteiros
    .transform((val) => parseInt(val, 10))
    .optional(),
  description: z
    .string({
      message: "Descrição do produto deve ser informada!",
    })
    .optional(),
  stock_quantity: z
    .string({ message: "Quantidade em estoque deve ser informado!" })
    .regex(/^\d+$/, {
      message: "Quantidade em estoque deve ser um número inteiro!",
    })
    .transform((val) => parseInt(val, 10))
    .optional(),
  price: z
    .string({ message: "Preço do produto deve ser informado!" })
    .refine((val) => /^[0-9]+(,[0-9]{1,2})?$/.test(val), {
      message: "O preço deve estar no formato válido (ex: '1000,50')",
    })
    .optional(),
});
