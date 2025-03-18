"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteFileAWS, uploadFileAWS } from "../aws";
import { SubCategory } from "../sub-category";
import { ProductSchema } from "@/lib/schemas-validator/product.schema";
import { Promotion } from "../promotions";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "../session-validation";

export type ProductErrorsT = {
  name?: string[];
  subcategory_id?: string[];
  description?: string[];
  price?: string[];
  stock_quantity?: string[];
};

export type ProductStateActionT = {
  success: boolean;
  error?: string;
  errors?: ProductErrorsT | null;
};

export type Product = {
  id: number;
  name: string;
  subcategory_id?: number;
  stock_quantity: number;
  price: number;
  description: string;
  product_images?: any[];
  promotions?: Promotion[];
  subcategory?: SubCategory;
  created_at?: Date;
  updated_at?: Date;
};

export async function CreateProduct(formData: FormData) {
  const rawObject: Record<string, string> = {};

  formData.forEach((value, key) => {
    rawObject[key] = value.toString();
  });

  const images = formData.getAll("photos") as File[];
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        description: rawObject?.description,
        name: rawObject.name,
        stock_quantity: parseInt(rawObject.stock_quantity),
        subcategory_id: parseInt(rawObject.subcategory_id),
        price: parseFloat(rawObject.price.replace(/\./g, "").replace(",", ".")),
      },
    });

    const imagePromises = images?.map(async (image) => {
      const fileData = await uploadFileAWS(image, image.type);
      await tx.product_images.create({
        data: {
          bucket: fileData.bucket,
          file_key: fileData.fileKey,
          url: fileData.url,
          product_id: product.id,
        },
      });
    });

    await Promise.all(imagePromises);
  });

  revalidatePath("/");

  return {
    success: true,
  };
}
export async function DeleteProduct({ id }: { id: number }) {
  const session = await auth();

  const validator = new SessionValidation(session);

  validator.IsAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, product_images: true },
  });

  if (!product) {
    throw new Error(
      "Não é possível deletar a categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!"
    );
  }

  const piPromises = product.product_images.map(async (pi) => {
    await deleteFileAWS(pi.file_key, pi.bucket);
    await prisma.product_images.delete({ where: { id: pi.id } });
  });

  await Promise.all(piPromises);

  await prisma.product.delete({ where: { id } });

  return {
    success: "Produto deletado com sucesso!",
  };
}

export async function EditProduct({
  formData,
  id,
}: {
  id: number;
  formData: FormData;
}) {
  const rawObject: Record<string, string> = {};

  formData?.forEach((value, key) => {
    rawObject[key] = value?.toString();
  });

  const product = await prisma.product.findFirst({
    where: { id },
  });

  if (!product) {
    throw new Error(
      "Não é possível editar a categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!"
    );
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      name: rawObject.name ? rawObject.name : product.name,
      subcategory_id: rawObject.subcategory_id
        ? Number(rawObject.subcategory_id)
        : product.subcategory_id,
      price: rawObject.price
        ? parseFloat(rawObject.price.replace(/\./g, "").replace(",", "."))
        : product.price,
      description: rawObject.description
        ? rawObject.description
        : product.description,
      stock_quantity: rawObject.stock_quantity
        ? parseInt(rawObject.stock_quantity)
        : product.stock_quantity,
    },
  });

  const images = formData.getAll("photos") as File[];

  const imagePromises = images?.map(async (image) => {
    const fileData = await uploadFileAWS(image, image.type);
    await prisma.product_images.create({
      data: {
        bucket: fileData.bucket,
        file_key: fileData.fileKey,
        url: fileData.url,
        product_id: product.id,
      },
    });
  });

  await Promise.all(imagePromises);

  return {
    success: "Produto editado com sucesso!",
  };
}

export async function GetAllProductsWithPagination({
  page = 1,
  perPage = 10,
  search,
}: {
  page: number;
  perPage?: number;
  search: string;
}) {
  const where: Prisma.productWhereInput = {
    OR: [
      {
        name: {
          contains: search || "",
          mode: "insensitive",
        },
      },
      !isNaN(Number(search))
        ? {
            id: Number(search),
          }
        : {},
    ],
  };

  const totalItems = await prisma.product.count({
    where,
  });

  const totalPages = Math.ceil(totalItems / perPage);

  const products = await prisma.product.findMany({
    where,
    include: {
      product_images: true,
      subcategory: true,
    },
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return {
    totalItems,
    totalPages,
    products,
  };
}

export async function getTop10SelledProducts() {
  const topSellingProducts = await prisma.order_item.groupBy({
    by: ["product_id"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 10,
  });

  const productIds = topSellingProducts.map((item) => item.product_id);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      product_images: {
        select: {
          url: true,
          id: true,
        },
      },
    },
  });

  return products;
}
