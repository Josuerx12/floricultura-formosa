"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteFileAWS, uploadFileAWS } from "../aws";
import { SubCategory } from "../sub-category";
import { ProductSchema } from "@/lib/schemas-validator/product.schema";
import { Promotion } from "../promotions";

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

export async function CreateProductAction(
  _: ProductStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const credentials = ProductSchema.parse({
      ...rawObject,
      subcategory_id: Number(rawObject.subcategory_id),
      price: parseFloat(rawObject.price),
      stock_quantity: parseInt(rawObject.stock_quantity),
    });

    const images = formData.getAll("photos") as File[];

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: credentials,
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

    revalidatePath("/dashboard/produtos");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (err: any) {
    let formattedErrors: ProductErrorsT | null = null;

    if (err instanceof z.ZodError) {
      formattedErrors = Object.fromEntries(
        Object.entries(err.format()).map(([key, value]) => [
          key,
          (value as any)._errors,
        ])
      ) as ProductErrorsT;
    }

    console.log(formattedErrors);

    return {
      success: false,
      error: err instanceof z.ZodError ? null : err.message,
      errors: formattedErrors,
    };
  }
}
export async function DeleteProductAction(
  _: ProductStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const product = await prisma.product.findFirst({
      where: { id: Number(rawObject.id) },
      select: { id: true, product_images: true },
    });

    if (!product) {
      return {
        success: false,
        error:
          "Não é possível deletar a categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    const piPromises = product.product_images.map(async (pi) => {
      await deleteFileAWS(pi.file_key, pi.bucket);
      await prisma.product_images.delete({ where: { id: pi.id } });
    });

    await Promise.all(piPromises);

    await prisma.product.delete({ where: { id: Number(rawObject.id) } });

    revalidatePath("/dashboard/categorias");

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export async function EditProductAction(
  _: ProductStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const product = await prisma.product.findFirst({
      where: { id: Number(rawObject.id) },
    });

    if (!product) {
      return {
        success: false,
        error:
          "Não é possível editar a categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: rawObject.name ? rawObject.name : product.name,
        subcategory_id: rawObject.subcategory_id
          ? Number(rawObject.subcategory_id)
          : product.subcategory_id,
        price: rawObject.price ? parseFloat(rawObject.price) : product.price,
        description: rawObject.description
          ? rawObject.description
          : product.description,
        stock_quantity: rawObject.stock_quantity
          ? parseInt(rawObject.stock_quantity)
          : product.stock_quantity,
      },
    });

    const images = formData.getAll("photos") as File[];

    if (images.length > 0) {
      for (let image of images) {
        console.log(image);
        const fileData = await uploadFileAWS(image, image.type);
        await prisma.product_images.create({
          data: {
            bucket: fileData.bucket,
            file_key: fileData.fileKey,
            url: fileData.url,
            product_id: product.id,
          },
        });
      }
    }

    revalidatePath("/dashboard/produtos");

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}
