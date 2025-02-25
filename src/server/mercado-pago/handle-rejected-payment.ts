import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";

export async function handleRejectedPayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata;
  const orderId = metadata.order_id;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      status: true,
      total_price: true,
      user: {
        select: {
          email: true,
        },
      },
      items: true,
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado!");
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELED",
    },
  });

  for (const product of order.items) {
    await prisma.product.update({
      where: {
        id: product.product_id,
      },
      data: {
        stock_quantity: {
          increment: product.quantity,
        },
      },
    });
  }

  transporter.sendMail({
    from: "Floricultura Formosa <contato@jcdev.com.br>",
    to: order.user.email,
    subject: "Pedido Cancelado",
    text: `Seu pedido número: ${order} foi cancelado.`,
  });
}
