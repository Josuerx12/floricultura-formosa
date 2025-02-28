// app/api/mercadopago-webhook/route.js

import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "@/lib/mercado-pago";
import { handleApprovedPayment } from "@/server/mercado-pago/handle-approved-payment";
import { handleRejectedPayment } from "@/server/mercado-pago/handle-rejected-payment";

export async function POST(request: Request) {
  try {
    verifyMercadoPagoSignature(request);

    const body = await request.json();

    const { type, data } = body;

    console.log("Received webhook event:", type, data);

    switch (type) {
      case "payment":
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });

        console.log(paymentData);

        if (
          paymentData.status === "approved" ||
          paymentData.date_approved !== null
        ) {
          await handleApprovedPayment(paymentData);
        }

        if (
          paymentData.status === "rejected" ||
          paymentData.status === "cancelled" ||
          paymentData.status === "refunded"
        ) {
          await handleRejectedPayment(paymentData);
        }

        break;
      default:
        console.log("Unhandled event type:", type);
    }

    console.log("Webhook handled successfully");

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
