import { z } from "zod";

export const BannerSchema = z.object({
  title: z.string({ message: "Titulo do banner deve ser informado!" }).min(3, {
    message: "Titulo do banner deve conter pelo menos 3 caracteres!",
  }),
  redirect_url: z.string({
    message: "Link para redirecionamento obrigatorio!",
  }),
});

export const EditBannerSchema = z.object({
  title: z
    .string({ message: "Titulo deve ser um texto." })
    .min(3, { message: "Titulo deve conter pelo menos 3 caracteres" })
    .optional(),
  isActive: z
    .boolean({ message: "Status deve ser ativado ou desativado." })
    .optional(),
  url: z
    .string({ message: "Url para redirecionamento deve ser um link." })
    .optional(),
});
