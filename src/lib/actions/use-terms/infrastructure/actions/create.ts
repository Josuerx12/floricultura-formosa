"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { UseTerms } from "../../domain/use-terms.entity";
import { UseTermsMapper } from "../mappers/use-terms.mapper";

export type CreateUseTermsInput = {
  content: string;
};

export const CreateUseTerms = async (data: CreateUseTermsInput) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const entity = new UseTerms({ content: data.content });

  await prisma.use_terms.create({
    data: UseTermsMapper.toModel(entity),
  });

  return { message: "Termo de uso criado com sucesso!" };
};
