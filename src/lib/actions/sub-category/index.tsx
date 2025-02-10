"use server";
import { prisma } from "@/lib/db/prisma";
import { SubCategorySchema } from "@/lib/schemas-validator/sub-category.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type SubCategoryErrorsT = {
  name?: string[];
  category_id?: string[];
};

export type SubCategoryStateActionT = {
  success: boolean;
  error?: string;
  errors?: SubCategoryErrorsT | null;
};

export type SubCategory = {
  id: number;
  category_id: number;
  name: string;
  created_at: Date;
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
    });

    const subCategory = await prisma.subcategory.findFirst({
      where: { name: credentials.name },
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

    console.log(subCategory);

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

    const subCategoryById = await prisma.subcategory.findFirst({
      where: { id: Number(rawObject.id) },
      select: {
        id: true,
      },
    });
    const subCategoryName = await prisma.subcategory.findFirst({
      where: { name: rawObject.name },
      select: {
        name: true,
      },
    });

    if (!subCategoryById) {
      return {
        success: false,
        error:
          "Não é possível editar a sub categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    if (subCategoryName) {
      return {
        success: false,
        error:
          "Nome da sub categoria não pode ser igual a outra sub categoria já cadastrada, tente outro nome!",
        errors: null,
      };
    }

    await prisma.subcategory.update({
      where: { id: Number(rawObject.id) },
      data: {
        name: rawObject.name,
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
