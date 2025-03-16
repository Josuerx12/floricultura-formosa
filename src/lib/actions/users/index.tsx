"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Prisma, UserRoles } from "@prisma/client";
import { SessionValidation } from "../session-validation";

export async function getAllUsersWithPagination({
  page,
  search,
  perPage = 10,
}: {
  page: number;
  search: string;
  perPage?: number;
}) {
  const where: Prisma.UserWhereInput = {
    OR: [
      {
        name: {
          contains: search || "",
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search || "",
          mode: "insensitive",
        },
      },
    ],
  };

  const totalItems = await prisma.user.count({
    where,
  });

  const totalPages = Math.ceil(totalItems / perPage);

  const users = await prisma.user.findMany({
    where,
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return {
    users,
    totalItems,
    totalPages,
  };
}

export async function editUser({
  id,
  data,
}: {
  id: string;
  data: { name: string; phone: string; email: string; role: UserRoles };
}) {
  const session = await auth();

  const validator = new SessionValidation(session);

  validator.IsAdmin();

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error(
      "Usuário a ser editado não encontrado, atualize a pagina e tente novamente."
    );
  }

  if (data.email && user.email != data.email) {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailExists) {
      throw new Error(
        "Não é possivel editar o usuário com o novo e-mail informado. Contate os administradores para mais informação."
      );
    }

    user.email = data.email;
  }

  if (data.phone) {
    user.phone = data.phone;
  }

  if (data.name) {
    user.name = data.name;
  }

  if (data.role) {
    user.role = data.role;
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: user,
  });

  return {
    message: "Usuário editado com sucesso!",
  };
}
