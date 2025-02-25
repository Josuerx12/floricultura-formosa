import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { handleApprovedPayment } from "@/server/mercado-pago/handle-approved-payment";

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

  const payment = new Payment(mpClient);
  const paymentData = await payment.get({ id: paymentId });

  if (paymentData.status === "approved" || paymentData.date_approved !== null) {
    await handleApprovedPayment(paymentData);

    return NextResponse.redirect(
      new URL(`/pagamentos?status=sucesso`, request.url)
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}
