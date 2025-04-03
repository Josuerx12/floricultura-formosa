"use client";
import CreateAddressModal from "@/components/modals/address/create";
import useCartStore from "@/hooks/use-cart-store";
import useMercadoPago from "@/hooks/use-mercado-pago";
import { getUserAddresses } from "@/lib/actions/address";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

const DeliveryForm = ({ user }: { user?: User }) => {
  const { products, addFee, removeFee, fee_id } = useCartStore();

  const { createMercadoPagoCheckout } = useMercadoPago();

  const { mutateAsync, isPending: isRedirecting } = useMutation({
    mutationKey: ["createMercadoPagoCheckout"],
    mutationFn: createMercadoPagoCheckout,
  });

  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    fee_id ? "delivery" : "pickup"
  );
  const [observation, setObservation] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddresses(user),
    refetchOnWindowFocus: true,
  });

  const selectedAddress = data?.find((address) => address.id === fee_id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await mutateAsync({
      cart: products,
      user: user as User,
      address: selectedAddress,
      observation,
    });
  };

  const submitBtn = isRedirecting ? (
    <button
      disabled
      className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold animate-pulse hover:bg-blue-700 transition"
    >
      Redirecionando
    </button>
  ) : (
    <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition">
      Finalizar Compra
    </button>
  );

  return (
    <div className="max-w-lg mx-auto p-6 my-4 rounded-lg">
      {user && (
        <h2 className="text-2xl font-semibold mb-4">
          Escolha o tipo de entrega
        </h2>
      )}

      {user && (
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="pickup"
              checked={deliveryType === "pickup"}
              onChange={() => {
                setDeliveryType("pickup");
                removeFee();
              }}
              className="form-radio"
            />
            <span>Retirada na Loja</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="radio"
              value="delivery"
              checked={deliveryType === "delivery"}
              onChange={() => setDeliveryType("delivery")}
              className="form-radio"
            />
            <span>Entrega</span>
          </label>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {user && (
          <>
            {deliveryType === "delivery" && (
              <div>
                {isPending && (
                  <div className="flex items-center justify-center gap-2">
                    <span>Carregando endereços</span>{" "}
                    <Loader2 className="animate-spin" />
                  </div>
                )}

                {data && (
                  <div className="flex flex-col gap-y-4">
                    {data.map((a) => {
                      return (
                        <label
                          key={a.id}
                          className="flex items-start space-x-2"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="pickup"
                              checked={fee_id === a.id}
                              onChange={() => {
                                a.delivery_fee &&
                                  addFee(a.delivery_fee.fee, a.id);
                              }}
                              className="form-radio"
                            />
                            <span className="font-bold">Endereço: </span>
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <span className="text-justify text-sm">
                              Rua: {a.street}, numero: {a.number}, bairro:{" "}
                              {a.district}, estado: {a.state}, cidade: {a.city},{" "}
                              {a.complement && "complemento:" + a.complement}{" "}
                            </span>
                            <span className="text-sm">
                              <b>
                                taxa:{" "}
                                {a.delivery_fee!.fee.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </b>
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
                <CreateAddressModal />
              </div>
            )}
            <label
              className="flex flex-col items-center w-full"
              htmlFor="observation"
            >
              <span>Observação</span>

              <textarea
                placeholder="Adicione uma observação."
                className="bg-neutral-200 w-full h-48 rounded p-2 text-neutral-900 placeholder:text-neutral-900"
                id="observation"
                onChange={(e) => setObservation(e.target.value)}
              />
            </label>
          </>
        )}
        {user ? (
          submitBtn
        ) : (
          <Link
            href="/login"
            className="mt-6 w-full text-center block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Autentique-se para continuar
          </Link>
        )}
      </form>
    </div>
  );
};

export default DeliveryForm;
