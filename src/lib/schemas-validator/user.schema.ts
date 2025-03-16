import { UserRoles } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  name: z
    .string({ message: "Nome deve ser informado!" })
    .min(3, { message: "Nome deve conter pelo menos 3 caracteres!" }),
  email: z
    .string({
      message: "E-mail é obrigatorio!",
    })
    .email({
      message: "E-mail deve ser valido!",
    }),
  phone: z
    .string({
      message: "Numero de telefone é obrigatorio!",
    })
    .min(8, { message: "O numero de telefone deve conter 8 caracteres!" })
    .optional(),
  password: z
    .string({ message: "Senha deve ser informada para criação da conta!" })
    .min(6, { message: "A senha deve conter pelo menos 6 caracteres!" }),
});

export const EditUserSchema = z.object({
  name: z
    .string({ message: "Nome deve ser informado!" })
    .min(3, { message: "Nome deve conter pelo menos 3 caracteres!" })
    .optional(),
  email: z
    .string({
      message: "E-mail é obrigatorio!",
    })
    .email({
      message: "E-mail deve ser valido!",
    })
    .optional(),
  phone: z
    .string({
      message: "Numero de telefone é obrigatorio!",
    })
    .min(8, { message: "O numero de telefone deve conter 8 caracteres!" })
    .optional(),
  role: z.enum(["ADMIN", "USER", "SELLER"]).optional(),
});
