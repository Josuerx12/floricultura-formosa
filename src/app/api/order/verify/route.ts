import { prisma } from "@/lib/db/prisma";
import mpClient from "@/lib/mercado-pago";
import { handleApprovedPayment } from "@/server/mercado-pago/handle-approved-payment";
import { handleRejectedPayment } from "@/server/mercado-pago/handle-rejected-payment";
import { Preference } from "mercadopago";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const orders = await prisma.order.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      items: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const preference = new Preference(mpClient);

  console.log("Processando pagamentos...");

  const promises = orders.map(async (order) => {
    const preferenceData = order.mercado_pago_preference_id
      ? await preference.get({
          preferenceId: order.mercado_pago_preference_id,
        })
      : null;

    if (preferenceData) {
      if (!preferenceData.expiration_date_to) {
        return await handleRejectedPayment(undefined, order.id);
      }

      const expiresId =
        new Date(preferenceData.expiration_date_to).getTime() -
        new Date().getTime();
      if (expiresId <= 0) {
        return await handleRejectedPayment(undefined, order.id);
      }
    }

    if (!preferenceData) {
      return await handleRejectedPayment(undefined, order.id);
    }
  });

  await Promise.all(promises);

  console.log("Pagamentos processados com sucesso!");

  return NextResponse.json({ received: true }, { status: 200 });
}
