import { z } from "zod";

export const DeliveryFeeSchema = z.object({
  district: z.string({ message: "Nome do bairro deve ser informado!" }).min(3, {
    message: "Nome do bairro deve conter pelo menos 3 caracteres!",
  }),
  fee: z
    .string({ message: "Preço do produto deve ser informado!" })
    .refine((val) => /^[0-9]+(,[0-9]{1,2})?$/.test(val), {
      message: "O preço deve estar no formato válido (ex: '1000,50')",
    }),
});
