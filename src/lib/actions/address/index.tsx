"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { AddressSchema } from "@/lib/schemas-validator/address.schema";

export async function CreateAddressAction(data: any) {
  const session = await auth();

  if (!session) {
    throw new Error(
      "Usuário deve está logado para adicionar um novo endereço!"
    );
  }

  const address = AddressSchema.parse(data);

  const district = await prisma.delivery_fee.findUnique({
    where: {
      id: address.delivery_fee_id,
    },
  });

  if (!district) {
    throw new Error(
      "Bairro de entrega não foi encontrado! Entre em contato pelo suporte ou tente novamente!"
    );
  }

  await prisma.address.create({
    data: {
      ...address,
      user_id: session.user.id as string,
      district: district.district,
    },
  });
}

export async function getDistricts() {
  const districts = await prisma.delivery_fee.findMany();

  return districts;
}
