import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Order } from "@/lib/actions/orders";
import React from "react";

const LastSalesChart = ({ sales }: { sales: any[] }) => {
  return (
    <div className="basis-96 h-[500px] flex-grow overflow-y-auto border  shadow rounded-xl p-4">
      <h2 className="mb-4">Ultimas vendas</h2>

      <div className="flex flex-col gap-y-6">
        {sales.map((o) => {
          const avatar =
            o.user && o.user.image
              ? o.user.image
              : "https://github.com/shadcn.png";
          return (
            <div key={o.id} className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={avatar} alt="Avatar do usuário" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col text-sm">
                  <span className="font-medium">{o.user.name}</span>
                  <span className="text-neutral-600">{o.user.email}</span>
                </div>
              </div>

              <p className="flex flex-col text-sm">
                <span className="font-medium">Total gasto</span>
                <span>
                  {o.total_price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LastSalesChart;
