"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { deleteFileAWS, uploadFileAWS } from "../aws";
import { SubCategory } from "../sub-category";
import { Promotion } from "../promotions";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "../session-validation";
import { fromCents, toCents } from "@/lib/utils";

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
  is_visible: boolean;
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
        is_visible: rawObject.is_visible === "true",
        stock_quantity: parseInt(rawObject.stock_quantity),
        subcategory_id: parseInt(rawObject.subcategory_id),
        price: toCents(rawObject.price),
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

  await prisma.order_item.deleteMany({
    where: { product_id: id },
  });

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
      is_visible: rawObject.is_visible
        ? rawObject.is_visible === "true"
        : product.is_visible,
      subcategory_id: rawObject.subcategory_id
        ? Number(rawObject.subcategory_id)
        : product.subcategory_id,
      price: rawObject.price ? toCents(rawObject.price) : product.price,
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
  isVisible = false,
}: {
  page: number;
  perPage?: number;
  search: string;
  isVisible?: boolean;
}) {
  const where: Prisma.productWhereInput = {
    AND: [
      {
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
      },
      ...(isVisible ? [{ is_visible: true }] : []),
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
    products: products.map((p) => ({
      ...p,
      price: fromCents(p.price),
    })),
  };
}

export async function getTop20SelledProducts() {
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
    take: 20,
  });

  const productIds = topSellingProducts.map((item) => item.product_id);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      is_visible: true,
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

  return products.map((p) => ({
    ...p,
    price: fromCents(p.price),
  }));
}

export async function getDeluxeProducts() {
  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        category: {
          name: "categoria luxo",
        },
      },
      is_visible: true,
    },
    include: {
      product_images: {
        select: {
          url: true,
        },
      },
    },
  });

  return products.map((p) => ({
    ...p,
    price: fromCents(p.price),
  }));
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    where: {
      is_visible: true,
    },
  });

  return products.map((p) => ({
    ...p,
    price: fromCents(p.price),
  }));
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      product_images: true,
      subcategory: {
        include: {
          category: true,
        },
      },
      promotions: {
        where: {
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        orderBy: { start_date: "asc" },
        take: 1,
        select: {
          discount_percentage: true,
          end_date: true,
          start_date: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Producto não encontrado");
  }

  product.price = fromCents(product?.price);

  return product;
}
