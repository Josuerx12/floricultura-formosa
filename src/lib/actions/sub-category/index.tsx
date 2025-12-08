"use server";
import { prisma } from "@/lib/db/prisma";
import { SubCategorySchema } from "@/lib/schemas-validator/sub-category.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Product } from "../products";

export type SubCategoryErrorsT = {
  name?: string[];
  category_id?: string[];
  slug?: string[];
};

export type SubCategoryStateActionT = {
  success: boolean;
  error?: string;
  errors?: SubCategoryErrorsT | null;
};

export type SubCategory = {
  id: number;
  category_id?: number;
  slug: string;
  name: string;
  products?: Product[];
  created_at?: Date;
  updated_at?: Date;
};

export async function CreateSubCategoryAction(
  state: SubCategoryStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const credentials = SubCategorySchema.parse({
      name: rawObject.name,
      category_id: Number(rawObject.category_id),
      slug: rawObject.slug,
    });

    const subCategory = await prisma.subcategory.findFirst({
      where: { name: credentials.name, category_id: credentials.category_id },
    });

    if (subCategory) {
      return {
        success: false,
        error:
          "Não é possível criar uma sub categoria com esse nome pois, já existe uma cadastrada com o mesmo nome!",
        errors: null,
      };
    }

    await prisma.subcategory.create({
      data: credentials,
    });

    revalidatePath("/dashboard/sub-categorias");

    return {
      success: true,
    };
  } catch (err: any) {
    let formattedErrors: SubCategoryErrorsT | null = null;

    if (err instanceof z.ZodError) {
      formattedErrors = Object.fromEntries(
        Object.entries(err.format()).map(([key, value]) => [
          key,
          (value as any)._errors,
        ])
      ) as SubCategoryErrorsT;
    }

    console.log(formattedErrors);

    return {
      success: false,
      error: err instanceof z.ZodError ? null : err.message,
      errors: formattedErrors,
    };
  }
}
export async function DeleteSubCategoryAction(
  state: SubCategoryStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const subCategory = await prisma.subcategory.findFirst({
      where: { id: Number(rawObject.id) },
      select: { id: true },
    });

    if (!subCategory) {
      return {
        success: false,
        error:
          "Não é possível deletar a sub categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    await prisma.subcategory.delete({ where: { id: Number(rawObject.id) } });

    revalidatePath("/dashboard/sub-categorias");

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

export async function EditSubCategoryAction(
  state: SubCategoryStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const subCategory = await prisma.subcategory.findFirst({
      where: { id: Number(rawObject.id) },
    });

    if (!subCategory) {
      return {
        success: false,
        error: "Sub-categoria não encontrada para o id informado.",
        errors: null,
      };
    }

    const subCategorySlug = await prisma.subcategory.findFirst({
      where: { slug: rawObject.slug, NOT: { id: subCategory.id } },
      select: {
        name: true,
      },
    });

    if (subCategorySlug) {
      return {
        success: false,
        error:
          "Slug da sub categoria não pode ser igual a outra sub categoria já cadastrada, tente outro nome!",
        errors: null,
      };
    }

    await prisma.subcategory.update({
      where: { id: Number(rawObject.id) },
      data: {
        name: rawObject.name || subCategory.name,
        slug: rawObject.slug || subCategory.slug,
      },
    });

    revalidatePath("/dashboard/sub-categorias");

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
