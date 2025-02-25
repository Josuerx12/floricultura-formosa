import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";

export async function GET(request: Request) {
  // Rota para lidar com pagamentos pendentes do Mercado Pago (i.e Pix)
  // Quando o cliente clica no botão 'Voltar para o site' no Checkout depois de pagar (ou não) o Pix
  const { searchParams } = new URL(request.url);
  // Pegamos o ID do pagamento do nosso sistema
  const orderId = searchParams.get("external_reference");

  console.log(orderId);

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

  return NextResponse.redirect(
    new URL(`/pagamentos?status=falha`, request.url)
  );
}
