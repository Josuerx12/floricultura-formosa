import { z } from "zod";

export const BannerSchema = z.object({
  title: z.string({ message: "Titulo do banner deve ser informado!" }).min(3, {
    message: "Titulo do banner deve conter pelo menos 3 caracteres!",
  }),
  redirect_url: z.string({
    message: "Link para redirecionamento obrigatorio!",
  }),
});
