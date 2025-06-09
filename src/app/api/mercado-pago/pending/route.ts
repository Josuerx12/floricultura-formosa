import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { WppRepository } from "@/lib/actions/jcwpp/infra/wpp.repository";
import { parseOrderStatus } from "@/lib/utils";

export async function GET(request: Request) {
  // Rota para lidar com pagamentos pendentes do Mercado Pago (i.e Pix)
  // Quando o cliente clica no botão 'Voltar para o site' no Checkout depois de pagar (ou não) o Pix
  const { searchParams } = new URL(request.url);
  // Pegamos o ID do pagamento no Mercado Pago
  const paymentId = searchParams.get("payment_id");
  // Pegamos o ID do pagamento do nosso sistema
  const orderId = searchParams.get("external_reference");

  if (!paymentId || !orderId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const wpp = new WppRepository();

  const payment = new Payment(mpClient);
  const paymentData = await payment.get({ id: paymentId });

  if (paymentData.status === "approved" || paymentData.date_approved !== null) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        order_preferences: true,
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    if (order) {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: { status: "PROCESSING" },
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

      transporter.sendMail({
        from: `Floricultura Formosa <${process.env.MAIL}>`,
        to: order!.user.email,
        subject: "Pedido Processado",
        text: `Seu pedido numero: ${order?.id} foi processado com sucesso.`,
      });
    }

    return NextResponse.redirect(
      new URL(`/pagamentos?status=sucesso`, request.url)
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}
