"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { PrivacyTerms } from "../../domain/privacy-terms.entity";
import { PrivacyTermsMapper } from "../mappers/privacy-terms.mapper";

export type CreatePrivacyTermsInput = {
  content: string;
};

export const CreatePrivacyTerms = async (data: CreatePrivacyTermsInput) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const entity = new PrivacyTerms({ content: data.content });

  await prisma.privacity_terms.create({
    data: PrivacyTermsMapper.toModel(entity),
  });

  return { message: "Termo de privacidade criado com sucesso!" };
};
