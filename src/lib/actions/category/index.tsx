"use server";
import { prisma } from "@/lib/db/prisma";
import { CategorySchema } from "@/lib/schemas-validator/category.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type CategoryErrorsT = {
  category?: string[];
};

export type CategoryStateActionT = {
  success: boolean;
  error?: string;
  errors?: CategoryErrorsT | null;
};

export type Category = {
  id: number;
  name: string;
  created_at: Date;
};

export async function CreateCategoryAction(
  state: CategoryStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const credentials = CategorySchema.parse(rawObject);

    const category = await prisma.category.findFirst({
      where: { name: credentials.category },
    });

    if (category) {
      return {
        success: false,
        error:
          "Não é possível criar uma categoria com esse nome pois, já existe uma cadastrada com o mesmo nome!",
        errors: null,
      };
    }

    await prisma.category.create({
      data: {
        name: credentials.category,
      },
    });

    revalidatePath("/dashboard/categorias");

    return {
      success: true,
    };
  } catch (err: any) {
    let formattedErrors: CategoryErrorsT | null = null;

    if (err instanceof z.ZodError) {
      formattedErrors = Object.fromEntries(
        Object.entries(err.format()).map(([key, value]) => [
          key,
          (value as any)._errors,
        ])
      ) as CategoryErrorsT;
    }

    console.log(formattedErrors);

    return {
      success: false,
      error: err instanceof z.ZodError ? null : err.message,
      errors: formattedErrors,
    };
  }
}
export async function DeleteCategoryAction(
  state: CategoryStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const category = await prisma.category.findFirst({
      where: { id: Number(rawObject.id) },
      select: { id: true },
    });

    if (!category) {
      return {
        success: false,
        error:
          "Não é possível deletar a categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    await prisma.category.delete({ where: { id: Number(rawObject.id) } });

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

export async function EditCategoryAction(
  state: CategoryStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const categoryById = await prisma.category.findFirst({
      where: { id: Number(rawObject.id) },
      select: {
        id: true,
      },
    });
    const categoryName = await prisma.category.findFirst({
      where: { name: rawObject.name },
      select: {
        name: true,
      },
    });

    if (!categoryById) {
      return {
        success: false,
        error:
          "Não é possível editar a categoria selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    if (categoryName) {
      return {
        success: false,
        error:
          "Nome da categoria não pode ser igual a outra categoria já cadastrada, tente outro nome!",
        errors: null,
      };
    }

    await prisma.category.update({
      where: { id: Number(rawObject.id) },
      data: {
        name: rawObject.name,
      },
    });

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
