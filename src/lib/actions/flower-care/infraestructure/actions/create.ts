"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";
import { FlowerCare } from "../../domain/flower-care.entity";
import { FlowerCareMapper } from "../mappers/flower-care.mapper";
import { fileTypes, uploadFileAWS } from "@/lib/actions/aws";

export type CreateFlowerCareInput = {
  title: string;
  description: string;
  imageUrl: string;
};

export const CreateFlowerCare = async (data: FormData) => {
  const session = await auth();
  new SessionValidation(session).IsSellerOrAdmin();

  const file = data.get("file") as File;
  const title = data.get("title");
  const description = data.get("description");

  if (!file) throw new Error("Arquivo não encontrado!");

  const fileData = await uploadFileAWS(file, fileTypes.AVATAR);

  const entity = new FlowerCare({
    title,
    description,
    imageUrl: fileData.url,
  });

  await prisma.flower_care.create({
    data: FlowerCareMapper.toModel(entity),
  });

  return { message: "Cuidados criados com sucesso!" };
};
