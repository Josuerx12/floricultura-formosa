import { auth } from "@/lib/auth/auth";
import React from "react";
import Title from "@/components/title";
import { getOrdersByUser } from "@/lib/actions/orders";
import { parseOrderStatus } from "@/lib/utils";
import ProfileForm from "./components/ProfileForm";

const ProfilePage = async () => {
  const session = await auth();

  const user = session?.user;

  const orders = await getOrdersByUser({});
  return (
    <main className="max-w-screen-xl w-full mx-auto">
      <Title>Perfil</Title>
      <ProfileForm user={user as any} />
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
