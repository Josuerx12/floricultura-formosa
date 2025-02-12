"use server";

import { prisma } from "@/lib/db/prisma";
import { PromotionSchema } from "@/lib/schemas-validator/promotion.schema";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type PromotionErrorsT = {
  product_id?: string[];
  discount_percentage?: string[];
  start_date?: string[];
  end_date?: string[];
};

export type PromotionStateActionT = {
  success: boolean;
  error?: string;
  errors?: PromotionErrorsT | null;
};

export type Promotion = {
  id?: number;
  product_id?: number;
  discount_percentage?: Decimal;
  start_date?: Date;
  end_date?: Date;
};

export async function CreatePromotionAction(
  state: PromotionStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const credentials = PromotionSchema.parse({
      start_date: rawObject.start_date ? new Date(rawObject.start_date) : null,
      end_date: rawObject.end_date ? new Date(rawObject.end_date) : null,
      product_id: Number(rawObject.product_id),
      discount_percentage: Number(rawObject.discount_percentage),
    });

    const promotionProduct = await prisma.promotions.findFirst({
      where: {
        AND: [
          {
            product_id: credentials.product_id,
          },
          {
            start_date: {
              lte: new Date(),
            },
          },
          {
            end_date: {
              gte: new Date(),
            },
          },
        ],
      },
    });

    if (promotionProduct) {
      return {
        success: false,
        error:
          "Não é possível criar uma promoção para esse produto pois já existe uma ativa!",
        errors: null,
      };
    }

    await prisma.promotions.create({
      data: credentials,
    });

    revalidatePath("/dashboard/ofertas");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (err: any) {
    let formattedErrors: PromotionErrorsT | null = null;

    if (err instanceof z.ZodError) {
      formattedErrors = Object.fromEntries(
        Object.entries(err.format()).map(([key, value]) => [
          key,
          (value as any)._errors,
        ])
      ) as PromotionErrorsT;
    }

    console.log(formattedErrors);

    return {
      success: false,
      error: err instanceof z.ZodError ? null : err.message,
      errors: formattedErrors,
    };
  }
}

export async function DeletePromotionAction(
  state: PromotionStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const promotions = await prisma.promotions.findFirst({
      where: { id: Number(rawObject.id) },
      select: { id: true },
    });

    if (!promotions) {
      return {
        success: false,
        error:
          "Não é possível deletar a promoção selecionada pois ela não foi encontrada no banco de dados, atualize a pagina e tente novamente!",
        errors: null,
      };
    }

    await prisma.promotions.delete({ where: { id: Number(rawObject.id) } });

    revalidatePath("/dashboard/ofertas");

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
