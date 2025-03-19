"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { AddressSchema } from "@/lib/schemas-validator/address.schema";
import { revalidatePath } from "next/cache";

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

  revalidatePath("carrinho");
}

export async function getDistricts() {
  const districts = await prisma.delivery_fee.findMany();

  return districts;
}

export async function getUserAddresses() {
  const session = await auth();
  const user = session?.user;

  const addresses = await prisma.address.findMany({
    where: {
      user_id: user?.id,
    },
    select: {
      id: true,
      street: true,
      number: true,
      district: true,
      city: true,
      state: true,
      zipCode: true,
      complement: true,
      delivery_fee: {
        select: {
          fee: true,
        },
      },
    },
  });

  const addr = addresses.map((a) => ({
    ...a,
    delivery_fee: {
      fee: a.delivery_fee!.fee.toNumber(),
    },
  }));

  return addr;
}
