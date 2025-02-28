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
  console.log(preference);

  const promises = orders.map(async (order) => {
    const preferenceData = order.mercado_pago_preference_id
      ? await preference.get({
          preferenceId: order.mercado_pago_preference_id,
        })
      : null;

    console.log(preferenceData);

    // if (
    //   !preferenceData ||
    //   preferenceData. === "rejected" ||
    //   paymentData.status === "cancelled"
    // ) {
    //   await handleRejectedPayment(undefined, order.id);
    // }

    // if (
    //   paymentData &&
    //   (paymentData.status === "approved" || paymentData.date_approved !== null)
    // ) {
    //   await handleApprovedPayment(paymentData);
    // }
  });

  await Promise.all(promises);

  console.log("Pagamentos processados com sucesso!");

  return NextResponse.json({ received: true }, { status: 200 });
}
