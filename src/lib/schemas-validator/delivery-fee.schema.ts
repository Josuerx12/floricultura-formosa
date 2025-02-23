import { z } from "zod";

export const DeliveryFeeSchema = z.object({
  district: z.string({ message: "Nome do bairro deve ser informado!" }).min(3, {
    message: "Nome do bairro deve conter pelo menos 3 caracteres!",
  }),
  fee: z.coerce.number().positive({ message: "Taxa deve ser informada!" }),
});
