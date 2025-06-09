import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { WppRepository } from "@/lib/actions/jcwpp/infra/wpp.repository";
import { triggerAsyncId } from "async_hooks";
import { parseOrderStatus } from "@/lib/utils";

export async function handleApprovedPayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata;
  const orderId = metadata.order_id;

  const wpp = new WppRepository();

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      status: true,
      total_price: true,
      address: true,
      order_preferences: true,
      user: {
        select: {
          email: true,
          phone: true,
          name: true,
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
    from: `Floricultura Formosa <${process.env.MAIL}>`,
    to: order.user.email,
    subject: "Pedido Processado",
    text: `Seu pedido numero: ${order.id} foi processado com sucesso.`,
  });
  if (order.user.phone) {
    wpp.sendMessageText(
      order.user.phone.includes("55")
        ? order.user.phone
        : `55${order.user.phone}`,
      `
     *🎉 🎉 Compra aprovada 🎉 🎉* \n\n 
     *ID:* ${order.id} \n
     *Status do pedido:*: ${parseOrderStatus(order).message} \n
     *De:* ${order.order_preferences[0].from} \n
     *Para:* ${order.order_preferences[0].to} \n
     *Entregar:* _${order.order_preferences[0].delivery_date}_
     `.trim()
    );
  }

  wpp.sendGroupMessageText(
    `
     *Venda Aprovada - Site* \n\n 
     *ID:* ${order.id} \n
     *Status do pedido:*: ${parseOrderStatus(order).message} \n
     *De:* ${order.order_preferences[0].from} \n
     *Para:* ${order.order_preferences[0].to} \n
     *Entregar:* _${order.order_preferences[0].delivery_date}_
     `.trim()
  );
}
