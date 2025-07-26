import DeliverToClientModal from "@/components/modals/orders/deliver-to-client";
import { getOrderById } from "@/lib/actions/orders";
import { auth } from "@/lib/auth/auth";
import { parseOrderStatus } from "@/lib/utils";
import { OrderStatus, UserRoles } from "@prisma/client";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { redirect } from "next/navigation";

const VendaPage = async ({ params }: { params: any }) => {
  const param = await params;
  const id = param.id;

  const session = await auth();
  const user = session?.user;

  if (!user || user?.role === UserRoles.USER) {
    redirect("/");
  }

  const sale = await getOrderById(id);

  if (!sale) {
    redirect("/dashboard/vendas");
  }

  const saleStatus = parseOrderStatus(sale);

  const mpConfig = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
  });

  const mpPayment = new Payment(mpConfig);

  const saleMpDetails = await mpPayment.get({
    id: sale.mercado_pago_preference_id!,
  });

  return (
    <main className="md:p-5 p-2 space-y-6">
      <h2 className="text-center text-xl font-bold">Detalhes da venda</h2>

      {/* Detalhes do Pedido */}

      <div className="border p-2 rounded max-w-screen-xl mx-auto">
        <h6 className="font-bold mb-6">Dados do pedido</h6>

        <div className="flex gap-2">
          <span className="font-bold">ID:</span> <p>{sale.id}</p>
        </div>

        <div className="flex gap-2">
          <span className="font-bold">Status da Compra:</span>{" "}
          <p>{saleStatus.message}</p>
        </div>

        {saleMpDetails && saleMpDetails.payment_method && (
          <div className="flex gap-2">
            <span className="font-bold">Metodo De Pagamento:</span>{" "}
            <p>{saleMpDetails.payment_method.type}</p>
          </div>
        )}

        {sale?.delivery_fee && (
          <div className="flex gap-2">
            <span className="font-bold">Taxa de Entrega:</span>{" "}
            <p>
              {Number(sale.delivery_fee).toLocaleString("pt", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <span className="font-bold">Total do Pedido:</span>{" "}
          <p>
            {Number(sale.total_price).toLocaleString("pt", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      {/* Endereço de entrega */}

      {sale.address && (
        <div className="border p-2 rounded max-w-screen-xl mx-auto">
          <h6 className="font-bold mb-6">Endereço de Entrega</h6>

          <div className="flex gap-2">
            <span className="font-bold">CEP:</span>{" "}
            <p>{sale.address.zipCode}</p>
          </div>

          <div className="flex gap-2">
            <span className="font-bold">Bairro:</span>{" "}
            <p>{sale.address.district}</p>
          </div>

          <div className="flex gap-2">
            <span className="font-bold">Rua:</span> <p>{sale.address.street}</p>
          </div>

          <div className="flex gap-2">
            <span className="font-bold">Numero:</span>{" "}
            <p>{sale.address.number}</p>
          </div>

          {sale.address.complement && (
            <div className="flex gap-2">
              <span className="font-bold">Complemento:</span>{" "}
              <p>{sale.address.complement}</p>
            </div>
          )}

          {sale?.order_preferences[0]?.delivery_date && (
            <div className="flex gap-2">
              <span className="font-bold">Data de Entrega:</span>{" "}
              <p>
                {new Date(
                  sale?.order_preferences[0]?.delivery_date
                ).toLocaleDateString("pt-br")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Produtos do Pedido */}
      <div className="border p-2 rounded max-w-screen-xl mx-auto">
        <h6 className="font-bold mb-6">Produtos do Pedido</h6>

        {sale.items.map((p) => {
          return (
            <div key={p.id} className="flex gap-2">
              <img
                src={p.product.product_images[0].url}
                className="w-32 h-32"
              />

              <div>
                <div className="flex gap-2">
                  <span className="font-bold">ID do Produto:</span>
                  <p>{p.product.id}</p>
                </div>

                <div className="flex gap-2">
                  <span className="font-bold">Nome do Produto:</span>
                  <p>{p.product.name}</p>
                </div>

                <div className="flex gap-2">
                  <span className="font-bold">Quantidade:</span>
                  <p>
                    {p.quantity} {p.quantity > 1 ? "UN's" : "UN"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="font-bold">Preço:</span>
                  <p>
                    {p.price.toLocaleString("pt", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        {sale.status === OrderStatus.PROCESSING && sale.address && (
          <DeliverToClientModal order={sale as any} />
        )}
      </div>
    </main>
  );
};

export default VendaPage;
