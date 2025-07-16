import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { WppRepository } from "@/lib/actions/jcwpp/infra/wpp.repository";

export async function handleRejectedPayment(
  paymentData?: PaymentResponse,
  order_id?: string
) {
  const metadata = paymentData?.metadata;
  const orderId = metadata?.order_id ?? order_id;

  const wpp = new WppRepository();

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
            phone: true,
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

      if (order?.user?.phone) {
        wpp.sendMessageText(
          order.user.phone.includes("55")
            ? order.user.phone
            : `55${order.user.phone}`,
          `
🌷 *Floricultura Formosa*

*❌ Compra não aprovada*

*Id: * ${order.id}

Não foi possivel processar seu pagamento.

_Acredita que foi um erro, entre em contato com suporte imediatamente com as provas._
          `
        );
      }

      transporter.sendMail({
        from: `Floricultura Formosa <${process.env.MAIL}>`,
        to: order.user.email,
        subject: "Pedido Cancelado",
        text: `Seu pedido número: ${order.id} foi cancelado.`,
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
  });
}
