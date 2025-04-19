"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { FlowerMeaning } from "../../domain/flower-meaning.entity";
import { FlowerMeaningMapper } from "../mappers/flower-meaning.mapper";

export type CreateFlowerMeaningInput = {
  name: string;
  description: string;
  imageUrl: string;
};

export const CreateFlowerMeaning = async (data: CreateFlowerMeaningInput) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const entity = new FlowerMeaning(data);
  await prisma.flower_meaning.create({
    data: FlowerMeaningMapper.toModel(entity),
  });

  return { message: "Significado criado com sucesso!" };
};
