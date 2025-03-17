"use server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SessionValidation } from "../session-validation";
import { deleteFileAWS } from "../aws";

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  file_key: string;
  bucket: string;
  created_at: Date;
};

export async function GetProductImages({
  product_id,
}: {
  product_id: number;
}): Promise<ProductImage[]> {
  const images = await prisma.product_images.findMany({
    where: {
      product_id,
    },
  });

  return images;
}

export async function deleteProductPhoto(id: number) {
  const session = await auth();

  const validator = new SessionValidation(session);

  validator.IsSellerOrAdmin();

  const image = await prisma.product_images.findUnique({
    where: {
      id,
    },
  });

  if (!image) {
    throw new Error("Imagem com esse ID não foi encontrada.");
  }

  await deleteFileAWS(image.file_key, image.bucket);

  await prisma.product_images.delete({
    where: {
      id,
    },
  });

  return {
    message: "Imagem deletada com sucesso!",
  };
}
