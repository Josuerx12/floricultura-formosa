import { z } from "zod";

export const PromotionSchema = z.object({
  discount_percentage: z
    .number({ message: "Porcentagem de disconto deve ser informado!" })
    .min(0, { message: "O desconto não pode ser negativo!" })
    .max(100, { message: "O desconto não pode ser maior que 100%!" }),
  product_id: z.number({
    message:
      "Produto não informado, selecione um produto para criar uma nova promoção.",
  }),
  start_date: z.date({
    message: "Data de inicio da promoção deve ser informado!",
  }),
  end_date: z.date({ message: "Data de fim da promoção deve ser informado!" }),
});
