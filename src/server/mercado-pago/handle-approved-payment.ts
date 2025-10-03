import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { WppRepository } from "@/lib/actions/jcwpp/infra/wpp.repository";
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

  order.status = "PROCESSING";

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
🌷 *Floricultura Formosa*

${
  order.status === "PROCESSING"
    ? "🎉 *Compra aprovada*"
    : "🚚 *Status da compra atualizado*"
}

*ID:* ${order.id}

*Status do pedido:*: ${parseOrderStatus(order).message}

*De:* ${order.order_preferences[0].from}

*Para:* ${order.order_preferences[0].to}

*Entregar:* _${order.order_preferences[0].delivery_date?.toLocaleDateString(
        "pt-BR"
      )}_

_Agradecemos pela sua compra! 🌷_
`
    );
  }

  wpp.sendGroupMessageText(
    `
🌷 *Floricultura Formosa*

*✅ Venda Aprovada - Site*

*ID:* ${order.id}

*Status do pedido:*: ${parseOrderStatus(order).message}

*De:* ${order.order_preferences[0].from}

*Para:* ${order.order_preferences[0].to}

*Entregar:* _${order.order_preferences[0].delivery_date}_
     `
  );
}
