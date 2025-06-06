import { z } from "zod";

export const AddressSchema = z.object({
  street: z
    .string({ message: "Nome da categoria deve ser informado!" })
    .min(3, {
      message: "Nome da Categoria deve conter pelo menos 3 caracteres!",
    }),
  number: z.string({ message: "Numero da residência deve ser informado!" }),
  complement: z
    .string({ message: "Complemento do endereço deve ser informado!" })
    .min(3, {
      message: "Complemento do endereço deve conter pelo menos 3 caracteres!",
    })
    .optional(),
  district: z
    .string({ message: "Bairro deve ser informado!" })
    .min(3, { message: "Bairro deve conter pelo menos 3 caracteres!" })
    .optional(),
  city: z.string({ message: "Cidade deve ser informada!" }),
  state: z.string({ message: "Estado deve ser informado!" }),
  zipCode: z
    .string({ message: "CEP deve ser informado!" })
    .regex(/^\d{5}\d{3}$/, {
      message: "CEP inválido! O formato correto é 00000-000.",
    }),
  delivery_fee_id: z.string({
    message: "ID da taxa de entrega deve ser informada!",
  }),
});
