"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { RefoundTerms } from "../../domain/refound-terms.entity";
import { RefoundTermsMapper } from "../mappers/refound-terms.mapper";

export type CreateRefoundTermsInput = {
  content: string;
};

export const CreateRefoundTerms = async (data: CreateRefoundTermsInput) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const entity = new RefoundTerms({ content: data.content });

  await prisma.refound_terms.create({
    data: RefoundTermsMapper.toModel(entity),
  });

  return { message: "Termo de uso criado com sucesso!" };
};
