import { NextRequest, NextResponse } from "next/server";
import { ProductCart } from "@/hooks/use-cart-store";
import { User } from "next-auth";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { Preference } from "mercadopago";
import { auth } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const cart: ProductCart[] = body.cart;
  const address = body.address;
  const orderPreferences = body.orderPreferences;
  const deliveryDate = body.deliveryDate;

  try {
    await prisma.$connect();
    const preference = new Preference({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });

    const session = await auth();

    const user = session!.user;

    const products = await verifyAndUpdateStock(cart);

    const totalPrice = products.reduce((acc, p) => {
      const totalPriceByProduct = p.unit_price * p.quantity;

      return acc + totalPriceByProduct;
    }, 0);

    const fee = address?.delivery_fee?.fee
      ? Number(address.delivery_fee.fee)
      : 0;

    const order = await prisma.order.create({
      data: {
        address_id: address?.id,
        delivery_fee: address ? Number(address.delivery_fee.fee) : 0,
        total_price: Number(totalPrice) + fee,
        items: {
          createMany: {
            data: products.map((p) => ({
              price: Number(p.unit_price),
              product_id: Number(p.id),
              quantity: Number(p.quantity),
            })),
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        order_preferences: {
          create: {
            delivery_date: deliveryDate,
            from: orderPreferences.from,
            phone: orderPreferences.phone,
            message: orderPreferences.message,
            to: orderPreferences.to,
          },
        },
      },
    });

    const cartList = cart.map((p) => ({
      id: p.id.toString(),
      title: p.name,
      quantity: p.quantity,
      unit_price: Number(p.price),
      picture_url: p.product_image,
      currency_id: "BRL",
      category_id: "category",
    }));

    if (address) {
      cartList.push({
        title: "Taxa de entrega",
        id: randomUUID(),
        quantity: 1,
        unit_price: Number(address.delivery_fee.fee),
        currency_id: "BRL",
        category_id: "category",
        picture_url: "",
      });
    }

    const createdPreference = await preference.create({
      body: {
        external_reference: order.id,
        ...(user.email && {
          payer: {
            email: user.email,
          },
        }),
        metadata: {
          orderId: order.id,
        },
        items: cartList,
        payment_methods: {
          installments: 12,
        },
        auto_return: "approved",
        back_urls: {
          success: `${req.headers.get("origin")}/pagamentos?status=sucesso`,
          failure: `${req.headers.get("origin")}/api/mercado-pago/failure`,
          pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
        },
        redirect_urls: {
          success: `${req.headers.get("origin")}/pagamentos?status=sucesso`,
          failure: `${req.headers.get("origin")}/api/mercado-pago/failure`,
          pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
        },
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(
          new Date().getTime() + 3600000
        ).toISOString(),
      },
    });

    if (!createdPreference.id) {
      throw new Error("No preferenceID");
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { mercado_pago_preference_id: createdPreference.id },
    });

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  } finally {
    await prisma.$disconnect();
  }
}

async function verifyAndUpdateStock(products: ProductCart[]) {
  const verifiedProducts = [];

  for (const product of products) {
    const stockedProduct = await prisma.product.findUnique({
      where: { id: Number(product.id) },
    });

    if (!stockedProduct) {
      throw new Error(`Produto "${product.name}" não encontrado.`);
    }

    if (product.quantity > stockedProduct.stock_quantity) {
      throw new Error(`Estoque insuficiente para o produto "${product.name}".`);
    }

    if (product.price < stockedProduct.price / 100) {
      throw new Error(
        `O preço do produto "${product.name}" parece estar adulterado.`
      );
    }

    await prisma.product.update({
      where: { id: Number(product.id) },
      data: {
        stock_quantity: { decrement: Number(product.quantity) },
      },
    });

    verifiedProducts.push({
      id: product.id.toString(),
      title: product.name,
      quantity: product.quantity,
      unit_price: product.price,
      picture_url: product.product_image,
      currency_id: "BRL",
      category_id: "category",
    });
  }

  return verifiedProducts;
}
