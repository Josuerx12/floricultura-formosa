import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";

export async function handleRejectedPayment(
  paymentData?: PaymentResponse,
  order_id?: string
) {
  const metadata = paymentData?.metadata;
  const orderId = metadata.order_id ?? order_id;

  await prisma.$transaction(async (db) => {
    const order = await db.order.findUnique({
      where: {
        id: orderId,
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

    if (order) {
      await db.order.update({
        where: {
          id: order.id,
        },
        data: { status: "CANCELED" },
      });
    }

    const promisseArray =
      order?.items.map(
        async (item) =>
          await db.product.update({
            where: { id: item.product_id },
            data: {
              stock_quantity: {
                increment: item.quantity,
              },
            },
          })
      ) || [];

    if (promisseArray.length > 0) {
      await Promise.all(promisseArray);
    }

    transporter.sendMail({
      from: "Floricultura Formosa <contato@jcdev.com.br>",
      to: order!.user.email,
      subject: "Pedido Cancelado",
      text: `Seu pedido número: ${order?.id} foi cancelado.`,
    });
  });
}
