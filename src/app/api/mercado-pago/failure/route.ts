import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { WppRepository } from "@/lib/actions/jcwpp/infra/wpp.repository";

export async function GET(request: Request) {
  // Rota para lidar com pagamentos pendentes do Mercado Pago (i.e Pix)
  // Quando o cliente clica no botão 'Voltar para o site' no Checkout depois de pagar (ou não) o Pix
  const { searchParams } = new URL(request.url);
  // Pegamos o ID do pagamento do nosso sistema
  const orderId = searchParams.get("external_reference");

  const wpp = new WppRepository();

  if (!orderId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

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

      if (order.user.phone) {
        wpp.sendMessageText(
          order.user.phone.includes("55")
            ? order.user.phone
            : `55${order.user.phone}`,
          `
          *❌ ❌ Compra não aprovada ❌ ❌*\n\n
          *ID: * ${order.id}\n
          Não foi possivel processar seu pagamento.\n\n
          _Acredita que foi um erro, entre em contato com suporte imediatamente com as provas._
          `.trim()
        );

        transporter.sendMail({
          from: `Floricultura Formosa <${process.env.MAIL}>`,
          to: order!.user.email,
          subject: "Pedido Cancelado",
          text: `Seu pedido número: ${order?.id} foi cancelado.`,
        });
      }
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

  return NextResponse.redirect(
    new URL(`/pagamentos?status=falha`, request.url)
  );
}
