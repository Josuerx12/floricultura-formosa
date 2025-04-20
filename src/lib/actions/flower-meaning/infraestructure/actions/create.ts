"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { FlowerMeaning } from "../../domain/flower-meaning.entity";
import { FlowerMeaningMapper } from "../mappers/flower-meaning.mapper";
import { fileTypes, uploadFileAWS } from "@/lib/actions/aws";

export type CreateFlowerMeaningInput = {
  name: string;
  description: string;
  imageUrl: string;
};

export const CreateFlowerMeaning = async (data: FormData) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const file = data.get("file") as File;
  const name = data.get("name");
  const description = data.get("description");

  if (!file) throw new Error("Arquivo não encontrado!");

  const fileData = await uploadFileAWS(file, fileTypes.AVATAR);

  const entity = new FlowerMeaning({
    name,
    description,
    imageUrl: fileData.url,
  });

  await prisma.flower_meaning.create({
    data: FlowerMeaningMapper.toModel(entity),
  });

  return { message: "Significado criado com sucesso!" };
};
