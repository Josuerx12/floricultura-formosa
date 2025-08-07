import DeliverToClientModal from "@/components/modals/orders/deliver-to-client";
import ReciveOrderModal from "@/components/modals/orders/recive";
import { getOrderById } from "@/lib/actions/orders";
import { auth } from "@/lib/auth/auth";
import { parseOrderStatus } from "@/lib/utils";
import { OrderStatus, UserRoles } from "@prisma/client";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { PaymentSearchResult } from "mercadopago/dist/clients/payment/search/types";
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

  let saleMpDetails: PaymentSearchResult | null | undefined = null;

  try {
    const mpPayment = new Payment(mpConfig);

    const searchResult = await mpPayment.search({
      options: {
        external_reference: sale.id,
      },
    });

    saleMpDetails = searchResult.results && searchResult.results[0];
  } catch (error) {
    console.log(error);
  }

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

        {saleMpDetails && saleMpDetails.payment_method_id && (
          <div className="flex gap-2">
            <span className="font-bold">Metodo De Pagamento:</span>{" "}
            <p>{saleMpDetails.payment_method_id}</p>
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

        {sale?.items.length > 0 && (
          <div className="flex gap-2">
            <span className="font-bold">Total dos Produtos:</span>{" "}
            <p>
              {Number(
                sale.items.reduce((acc, item) => acc + item.price, 0)
              ).toLocaleString("pt", {
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

        {!sale.address && <h2 className="font-bold">Retirada na Loja</h2>}
      </div>

      {/* Dados do Cliente */}

      <div className="border p-2 rounded max-w-screen-xl mx-auto">
        <h6 className="font-bold mb-6">Dados do Cliente</h6>

        <div className="flex gap-2">
          <span className="font-bold">Nome:</span> <p>{sale.user.name}</p>
        </div>

        <div className="flex gap-2">
          <span className="font-bold">Documento Cadastrado:</span>{" "}
          <p>{sale.user.document}</p>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Telefone:</span> <p>{sale.user.phone}</p>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Data de Aniversario:</span>{" "}
          <p>{sale.user.birthdate?.toLocaleDateString("pt-BR")}</p>
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
              <span className="font-bold">Data de Entrega Desejada:</span>{" "}
              <p>
                {new Date(
                  sale?.order_preferences[0]?.delivery_date
                ).toLocaleDateString("pt-br")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preferencias Do Pedido */}
      {sale.order_preferences && (
        <div className="border p-2 rounded max-w-screen-xl mx-auto">
          <h6 className="font-bold mb-6">Preferencias do Pedido</h6>

          <div className="flex gap-2">
            <span className="font-bold">De:</span>{" "}
            <p>{sale.order_preferences[0].from}</p>
          </div>

          <div className="flex gap-2">
            <span className="font-bold">Para:</span>{" "}
            <p>{sale.order_preferences[0].to}</p>
          </div>

          <div className="flex gap-2">
            <span className="font-bold">Telefone:</span>{" "}
            <p>{sale.order_preferences[0].phone}</p>
          </div>

          <div className="flex gap-2">
            <span className="font-bold">Mensagem:</span>{" "}
            <p className="text-justify">{sale.order_preferences[0].message}</p>
          </div>
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

      <div className="max-w-screen-xl mx-auto">
        {sale.status === OrderStatus.PROCESSING && sale.address && (
          <DeliverToClientModal order={sale as any} />
        )}
        {(sale.status === OrderStatus.SHIPPED || !sale.address) && (
          <ReciveOrderModal btnMessage="Entregar Pedido" order={sale as any} />
        )}
      </div>
    </main>
  );
};

export default VendaPage;
