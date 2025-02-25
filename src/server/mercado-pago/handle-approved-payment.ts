import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";

export async function handleApprovedPayment(paymentData: PaymentResponse) {
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
      status: "PROCESSING",
    },
  });

  transporter.sendMail({
    from: "Floricultura Formosa <contato@jcdev.com.br>",
    to: order.user.email,
    subject: "Pedido Processado",
    text: `Seu pedido numero: ${order.id} foi processado com sucesso.`,
  });
}
