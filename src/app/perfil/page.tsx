import { auth } from "@/lib/auth/auth";
import React from "react";
import Image from "next/image";
import { FileImage } from "lucide-react";
import Title from "@/components/title";
import { getOrdersByUser } from "@/lib/actions/orders";
import { parseOrderStatus } from "@/lib/utils";

const ProfilePage = async () => {
  const session = await auth();

  const user = session?.user;

  const orders = await getOrdersByUser({});
  return (
    <main className="max-w-screen-xl w-full mx-auto">
      <Title>Perfil</Title>

      <form className="w-full mx-auto shadow-lg p-4 mb-4 rounded-md border">
        <div className="flex flex-col w-fit items-center mx-auto">
          <Image
            src={user?.image ? user.image : "/no-profile.svg"}
            width={100}
            height={100}
            quality={100}
            alt="profile pic"
            className="rounded-full"
          />

          <input
            type="file"
            id="file"
            multiple={false}
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <label
            title="Alterar foto de perfil!"
            htmlFor="file"
            className="w-fit bg-primary p-2 rounded mt-3 text-sm text-primary-foreground cursor-pointer hover:text-primary hover:bg-primary-foreground duration-200 flex gap-2 items-center"
          >
            <p>Alterar foto</p>
            <FileImage size={16} />
          </label>
        </div>
        <div className="flex flex-col gap-y-4 items-center w-full">
          <label className="w-full flex-grow">
            <span className="font-semibold text-sm">Nome:</span>
            <input
              className="w-full"
              type="text"
              defaultValue={user?.name ?? "Nome do usuário não identificado!"}
              disabled
            />
          </label>

          <label className="w-full flex-grow">
            <span className="font-semibold text-sm">Email:</span>
            <input
              className="w-full"
              type="email"
              defaultValue={user?.email ?? "Email não identificado!"}
              disabled
            />
          </label>

          <label className="w-full flex-grow">
            <span className="font-semibold text-sm">Telefone:</span>
            <input
              className="w-full"
              type="tel"
              defaultValue={user?.phone ?? "Sem numero cadastrado!"}
              disabled
            />
          </label>
        </div>
      </form>

      <Title>Historico de compras</Title>

      <div className="w-full max-h-[30rem] overflow-y-auto mx-auto shadow-lg p-4 mb-4 rounded-md border">
        {orders.data.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {orders.data.map((o) => {
              const status = parseOrderStatus(o);
              return (
                <li
                  key={o.id}
                  className="border p-4 rounded-md hover:shadow-md transition-all duration-200"
                >
                  <div className="grid items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <p>
                      <span className="font-semibold">ID do pedido:</span>{" "}
                      {o.id}
                    </p>
                    <p>
                      <span className="font-semibold">Frete:</span> R${" "}
                      {Number(o.delivery_fee).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span className={`${status.bgColor} ${status.textColor}`}>
                        {status.message}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Total:</span> R${" "}
                      {Number(o.total_price).toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            Você ainda não realizou nenhuma compra.
          </p>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
