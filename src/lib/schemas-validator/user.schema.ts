import { z } from "zod";

// Função para validar CPF ou CNPJ simples (sem libs externas)
function isValidCpfCnpj(value: string) {
  const numeric = value.replace(/\D/g, "");
  return numeric.length === 11 || numeric.length === 14;
}

export type UserType = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  name: z
    .string({ message: "Nome deve ser informado!" })
    .min(3, { message: "Nome deve conter pelo menos 3 caracteres!" }),

  email: z
    .string({ message: "E-mail é obrigatório!" })
    .email({ message: "E-mail deve ser válido!" }),

  phone: z
    .string({ message: "Número de telefone é obrigatório!" })
    .min(8, {
      message: "O número de telefone deve conter no mínimo 8 caracteres!",
    })
    .optional(),

  document: z
    .string({ message: "Documento deve ser informado!" })
    .refine((val) => isValidCpfCnpj(val), {
      message: "Documento deve ser um CPF ou CNPJ válido!",
    }),

  birthdate: z
    .string({ message: "Data de nascimento deve ser informada!" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de nascimento inválida!",
    })
    .transform((val) => new Date(val))
    .refine((date) => date < new Date(), {
      message: "A data de nascimento deve ser no passado!",
    }),

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
  document: z
    .string({ message: "Documento deve ser informado!" })
    .refine((val) => isValidCpfCnpj(val), {
      message: "Documento deve ser um CPF ou CNPJ válido!",
    })
    .optional(),
  birthdate: z
    .string({ message: "Data de nascimento deve ser informada!" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de nascimento inválida!",
    })
    .transform((val) => new Date(val))
    .refine((date) => date < new Date(), {
      message: "A data de nascimento deve ser no passado!",
    })
    .optional(),
  role: z.enum(["ADMIN", "USER", "SELLER"]).optional(),
});
