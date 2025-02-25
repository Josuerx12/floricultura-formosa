import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatus } from "@prisma/client";
import { Box, Info, PackageCheck, Truck } from "lucide-react";
import Image from "next/image";

const SalesCard = ({ sale }: { sale: any }) => {
  return (
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
                  <Image
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
                  <p className="text-gray-600 text-sm">{i.quantity} unidades</p>
                  <p className="text-gray-600 text-sm">
                    {i.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {sale.delivery_fee ? (
          <p>
            Frete:
            <strong className="ml-2">
              {sale.delivery_fee.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </p>
        ) : null}
        <p>
          Total da compra:
          <strong className="ml-2">
            {sale.total_price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </p>

        <Button className="hover:bg-primary-foreground hover:text-primary duration-200">
          Detalhes da venda <Info />
        </Button>
        {sale.status === OrderStatus.PROCESSING && (
          <Button className="hover:bg-primary-foreground hover:text-primary duration-200">
            Enviar para o cliente <Truck />
          </Button>
        )}
        {sale.status === OrderStatus.SHIPPED && (
          <Button className="hover:bg-primary-foreground hover:text-primary duration-200">
            Entregar ao cliente <PackageCheck />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesCard;
