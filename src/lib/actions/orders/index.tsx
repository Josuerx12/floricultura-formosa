"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { SessionValidation } from "../session-validation";
import { User } from "next-auth";
import { WppRepository } from "../jcwpp/infra/wpp.repository";
import { parseOrderStatus } from "@/lib/utils";

export type GetOrdersProps = {
  page?: string;
  perPage?: string;
  search?: string;
};

export type Order = {
  id: string;
  user_id: string;
  mercado_pago_preference_id?: string | null;
  address_id?: string | null;
  status: OrderStatus;
  total_price: number;
  delivery_fee: number;
  observation?: string | null;
  user: User;
  items: any[];
  address: any;
  createdAt: Date;
  updatedAt: Date;
};

export const getOrdersByUser = async ({
  page = "1",
  perPage = "10",
  search = "",
}: GetOrdersProps) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return redirect("/login");
  }

  const offset = (parseInt(page) - 1) * parseInt(perPage);

  const whereOptions: Prisma.orderWhereInput = {
    user_id: user.id,
    items: {
      some: {
        product: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    },
  };

  const totalOrders = await prisma.order.count({
    where: whereOptions,
  });

  const orders = await prisma.order.findMany({
    where: whereOptions,
    take: parseInt(perPage),
    skip: offset,
    include: {
      user: true,
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders.map((o) => ({
      ...o,
      total_price: Number(o.total_price),
      delivery_fee: Number(o.delivery_fee),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    page: parseInt(page),
    perPage: parseInt(perPage),
    totalPages: Math.ceil(totalOrders / parseInt(perPage)),
    totalItems: totalOrders,
  };
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  id: true,
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return order;
};

export const getCanceledOrders = async ({
  pageParam = 1,
  perPage = "10",
  search = "",
}) => {
  const session = await auth();
  const user = session?.user;

  if (user?.role != "SELLER" && user?.role != "ADMIN") {
    throw new Error("Acesso negado!");
  }

  const offset = (pageParam - 1) * parseInt(perPage);

  const totalOrders = await prisma.order.count({
    where: {
      status: "CANCELED",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      status: "CANCELED",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    take: parseInt(perPage),
    skip: offset,
    include: {
      user: true,
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders.map((o) => ({
      ...o,
      total_price: Number(o.total_price),
      delivery_fee: Number(o.delivery_fee),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    next_page: orders.length === parseInt(perPage) ? pageParam + 1 : null,
    totalPages: Math.ceil(totalOrders / parseInt(perPage)),
    totalItems: totalOrders,
  };
};

export const getProcessedOrders = async ({
  pageParam = 1,
  perPage = "10",
  search = "",
}) => {
  const session = await auth();
  const user = session?.user;

  if (user?.role != "SELLER" && user?.role != "ADMIN") {
    throw new Error("Acesso negado!");
  }

  const offset = (pageParam - 1) * parseInt(perPage);

  const totalOrders = await prisma.order.count({
    where: {
      status: "PROCESSING",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      status: "PROCESSING",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    take: parseInt(perPage),
    skip: offset,
    include: {
      user: true,
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders.map((o) => ({
      ...o,
      total_price: Number(o.total_price),
      delivery_fee: Number(o.delivery_fee),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    next_page: orders.length === parseInt(perPage) ? pageParam + 1 : null,
    totalPages: Math.ceil(totalOrders / parseInt(perPage)),
    totalItems: totalOrders,
  };
};

export const getDeliveredOrders = async ({
  pageParam = 1,
  perPage = "10",
  search = "",
}) => {
  const session = await auth();
  const user = session?.user;

  if (user?.role != "SELLER" && user?.role != "ADMIN") {
    throw new Error("Acesso negado!");
  }

  const offset = (pageParam - 1) * parseInt(perPage);

  const totalOrders = await prisma.order.count({
    where: {
      status: "DELIVERED",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    take: parseInt(perPage),
    skip: offset,
    include: {
      user: true,
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders.map((o) => ({
      ...o,
      total_price: Number(o.total_price),
      delivery_fee: Number(o.delivery_fee),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    next_page: orders.length === parseInt(perPage) ? pageParam + 1 : null,
    totalPages: Math.ceil(totalOrders / parseInt(perPage)),
    totalItems: totalOrders,
  };
};

export const getShippedOrders = async ({
  pageParam = 1,
  perPage = "10",
  search = "",
}) => {
  const session = await auth();
  const user = session?.user;

  if (user?.role != "SELLER" && user?.role != "ADMIN") {
    throw new Error("Acesso negado!");
  }

  const offset = (pageParam - 1) * parseInt(perPage);

  const totalOrders = await prisma.order.count({
    where: {
      status: "SHIPPED",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      status: "SHIPPED",
      OR: [
        {
          id: {
            contains: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          items: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          address: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    take: parseInt(perPage),
    skip: offset,
    include: {
      user: true,
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders.map((o) => ({
      ...o,
      total_price: Number(o.total_price),
      delivery_fee: Number(o.delivery_fee),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    next_page: orders.length === parseInt(perPage) ? pageParam + 1 : null,
    totalPages: Math.ceil(totalOrders / parseInt(perPage)),
    totalItems: totalOrders,
  };
};

export const getPendingOrders = async ({
  pageParam = 1,
  perPage = "10",
  search = "",
}) => {
  const session = await auth();
  const user = session?.user;

  if (user?.role !== "SELLER" && user?.role !== "ADMIN") {
    return redirect("/");
  }

  const offset = (pageParam - 1) * parseInt(perPage);

  const totalOrders = await prisma.order.count({
    where: {
      status: "PENDING",
      OR: [
        { id: { contains: search } },
        {
          user: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        {
          items: {
            some: {
              product: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          address: {
            city: { contains: search, mode: "insensitive" },
          },
        },
      ],
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      OR: [
        { id: { contains: search } },
        {
          user: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        {
          items: {
            some: {
              product: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          address: {
            city: { contains: search, mode: "insensitive" },
          },
        },
      ],
    },
    take: parseInt(perPage),
    skip: offset,
    include: {
      user: true,
      order_preferences: true,
      items: {
        include: {
          product: {
            include: {
              product_images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders.map((o) => ({
      ...o,
      total_price: Number(o.total_price),
      delivery_fee: Number(o.delivery_fee),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    next_page: orders.length === parseInt(perPage) ? pageParam + 1 : null,
    totalPages: Math.ceil(totalOrders / parseInt(perPage)),
    totalItems: totalOrders,
  };
};

export async function DeliverOrder(id: string) {
  const wpp = new WppRepository();
  const session = await auth();

  const sessionValidate = new SessionValidation(session);

  sessionValidate.IsSellerOrAdmin();

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      order_preferences: true,
    },
  });

  if (!order) {
    throw new Error("Comprar não localizada para o id informado.");
  }

  order.status = OrderStatus.SHIPPED;

  await prisma.order.update({
    data: { status: order.status },
    where: {
      id,
    },
  });

  if (order.user.phone) {
    wpp.sendMessageText(
      order.user.phone,
      `
🌷 *Floricultura Formosa*
      
"🚚 *Status da compra atualizado*"
      
*ID:* ${order.id}
      
*Status do pedido:*: ${parseOrderStatus(order).message}
      
*De:* ${order.order_preferences[0].from}
      
*Para:* ${order.order_preferences[0].to}
      
*Entregar:* _${order.order_preferences[0].delivery_date}_
      
_Agradecemos pela sua compra! 🌷_
    `
    );
  }
  return {
    message: "Pedido enviado com sucesso!",
  };
}

export async function ReciveOrder(id: string) {
  const wpp = new WppRepository();
  const session = await auth();

  new SessionValidation(session);

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      order_preferences: true,
    },
  });

  if (!order) {
    throw new Error("Comprar não localizada para o id informado.");
  }

  order.status = OrderStatus.DELIVERED;

  await prisma.order.update({
    data: { status: order.status },
    where: {
      id,
    },
  });

  if (order.user.phone) {
    wpp.sendMessageText(
      order.user.phone,
      `
🌷 *Floricultura Formosa*
      
"🚚 *Status da compra atualizado*"
      
*ID:* ${order.id}
      
*Status do pedido:*: ${parseOrderStatus(order).message}
      
*De:* ${order.order_preferences[0].from}
      
*Para:* ${order.order_preferences[0].to}
      
*Entregar:* _${order.order_preferences[0].delivery_date}_
      
_Agradecemos pela sua compra! 🌷_
    `
    );
  }

  return {
    message: "Pedido recebido com sucesso!",
  };
}
