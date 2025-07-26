import ReciveOrderModal from "@/components/modals/orders/recive";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatus } from "@prisma/client";
import { Info, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SalesCard = ({ sale }: { sale: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }
  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-2 group p-2">
          <h3 className="font-semibold text-sm text-center my-3">
            Venda nº {sale.id}
          </h3>
          <div className="flex flex-col gap-6 mb-4">
            {sale?.items.map((i: any) => {
              return (
                <div key={i.id} className="flex gap-2">
                  {i.product?.product_images[0]?.url && (
                    <img
                      src={sale.items[0].product.product_images[0].url}
                      alt={sale.items[0].product.name}
                      width={50}
                      height={50}
                      className="rounded-md w-12 h-12"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {i.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {i.quantity} unidades
                    </p>
                    {/* <p className="text-gray-600 text-sm">
                      {fromCents(i.product.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p> */}
                  </div>
                </div>
              );
            })}
          </div>

          {sale?.observation && (
            <div className="bg-neutral-300 rounded-md p-2">
              <b>Observação: </b>
              {sale.observation}
            </div>
          )}

          {sale.delivery_fee && (
            <p>
              Frete:
              <strong className="ml-2">
                {sale.delivery_fee.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </p>
          )}

          <p>
            Total da compra:
            <strong className="ml-2">
              {sale.total_price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </p>
          <Link
            href={"/dashboard/vendas/" + sale.id}
            className="bg-neutral-700 rounded-md text-btn-text hover:bg-neutral-800 dura text-sm py-2 px-3 flex items-center justify-between"
          >
            Detalhes da venda <Info />
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default SalesCard;
