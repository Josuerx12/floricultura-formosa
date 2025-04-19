"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { FlowerCare } from "../../domain/flower-care.entity";
import { FlowerCareMapper } from "../mappers/flower-care.mapper";

export type CreateFlowerCareInput = {
  title: string;
  description: string;
  imageUrl: string;
};

export const CreateFlowerCare = async (data: CreateFlowerCareInput) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const entity = new FlowerCare(data);
  await prisma.flower_care.create({
    data: FlowerCareMapper.toModel(entity),
  });

  return { message: "Cuidados criados com sucesso!" };
};
