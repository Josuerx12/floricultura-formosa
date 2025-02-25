"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export type GetOrdersProps = {
  page?: string;
  perPage?: string;
  search?: string;
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

  const totalOrders = await prisma.order.count({
    where: {
      user_id: user.id,
      OR: [
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
      user_id: user.id,
      OR: [
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
