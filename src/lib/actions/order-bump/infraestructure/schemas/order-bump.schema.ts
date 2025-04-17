import { z } from "zod";

export const OrderBumpShema = z.object({
  bumpProductId: z
    .string()
    .min(1, "Produto do bump deve ser informado.")
    .transform((val) => Number(val)),
});
