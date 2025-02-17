import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const DeliveryForm = ({ cartDetails }: { cartDetails?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "pickup"
  );

  const { data: session } = useSession();

  const user = session?.user;

  const onSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    alert("Formulário enviado com sucesso!");
  };

  return (
    <div className="max-w-lg mx-auto p-6  my-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Escolha o tipo de entrega</h2>

      {/* Opções de entrega */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="pickup"
            checked={deliveryType === "pickup"}
            onChange={() => setDeliveryType("pickup")}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome do Recebedor */}
        <div>
          <label className="block font-medium">Nome do Recebedor</label>
          <input
            type="text"
            {...register("receiverName", {
              required: "Nome do recebedor é obrigatório",
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Formulário de Endereço (aparece apenas se for entrega) */}
        {deliveryType === "delivery" && (
          <>
            <div>
              <label className="block font-medium">CEP</label>
              <input
                type="text"
                {...register("cep", { required: "CEP é obrigatório" })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Município</label>
              <input
                type="text"
                {...register("city", { required: "Município é obrigatório" })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Rua</label>
              <input
                type="text"
                {...register("street", { required: "Rua é obrigatória" })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Número</label>
              <input
                type="text"
                {...register("number", { required: "Número é obrigatório" })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </>
        )}
        {user ? (
          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition">
            Finalizar Compra
          </button>
        ) : (
          <Link href={"/login"}>Autentique-se para continuar!</Link>
        )}
      </form>
    </div>
  );
};

export default DeliveryForm;
