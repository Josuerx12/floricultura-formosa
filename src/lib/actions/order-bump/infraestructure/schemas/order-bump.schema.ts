import { z } from "zod";

export const OrderBumpShema = z.object({
  bumpProductId: z
    .string()
    .min(1, "Produto do bump deve ser informado.")
    .transform((val) => Number(val)),
  bumpPrice: z
    .string({ message: "Preço do produto deve ser informado!" })
    .refine((val) => /^[0-9]+(,[0-9]{1,2})?$/.test(val), {
      message: "O preço deve estar no formato válido (ex: '1000,50')",
    }),
});
