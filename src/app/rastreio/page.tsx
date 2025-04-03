"use client";

import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/orders";
import { parseOrderStatus } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const RastreioPage = () => {
  const { register, handleSubmit, reset: resetForm, watch } = useForm();

  const { mutateAsync, data, isPending, reset } = useMutation({
    mutationKey: ["findOrderById"],
    mutationFn: getOrderById,
  });

  async function onSubmit(data: any) {
    await mutateAsync(data.id);
  }

  function resetRastreio() {
    reset();
    resetForm();
  }

  const parsedStatus = data && parseOrderStatus(data);

  return (
    <main className="w-full max-w-6xl mx-auto min-h-screen">
      <div className="mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          📦 Rastrear Encomenda
        </h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block text-gray-700">
            <span className="font-medium">ID da Compra</span>
            <div className="flex items-center gap-2 mt-2">
              <input
                className="p-2 w-full border rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
                {...register("id")}
                type="text"
                defaultValue={watch("id")}
                placeholder="cm7kp4fci000yve0b11n9cxi3"
              />
              <Button
                className="flex items-center gap-2 px-4 py-2"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Search size={18} />
                )}
                <span>Buscar</span>
              </Button>
            </div>
          </label>

          {data && (
            <Button type="button" onClick={resetRastreio} variant="link">
              Limpar busca
            </Button>
          )}
        </form>

        {/* Exibição dos detalhes do pedido */}
        {isPending && (
          <div className="flex justify-center items-center mt-6">
            <Loader2 className="animate-spin text-gray-600" size={24} />
          </div>
        )}

        {data && parsedStatus && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-100">
            <h4 className="text-lg font-semibold mb-3">Detalhes do pedido</h4>
            <div className="mb-2">
              <span className="font-bold">ID do pedido:</span> {data.id}
            </div>
            <div
              className={`p-2 rounded-lg flex items-center gap-2 ${parsedStatus.bgColor} ${parsedStatus.textColor} transition-all duration-300`}
            >
              <span className="font-semibold">Status:</span> ●{" "}
              <span>{parsedStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default RastreioPage;
