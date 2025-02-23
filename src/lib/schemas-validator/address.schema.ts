import { z } from "zod";

export const AddressSchema = z.object({
  street: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
  number: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
  complement: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    })
    .optional(),
  district: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    })
    .optional(),
  city: z.string({ message: "Nome da categoria deve ser informado!" }).min(3, {
    message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
  }),
  state: z.string({ message: "Nome da categoria deve ser informado!" }).min(3, {
    message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
  }),
  zipCode: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
  delivery_fee_id: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
});
