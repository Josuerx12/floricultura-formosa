import React from "react";
import Image from "next/image";
import SignUpForm from "./form";

const Page = () => {
  return (
    <div className="w-full h-full md:h-screen flex justify-center py-10 px-4">
      <div className="flex flex-col gap-6 p-6 py-8 h-fit max-w-md w-full bg-white shadow-lg rounded-2xl border border-gray-200">
        {/* Logo e Mensagem de Boas-vindas */}
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            width={80}
            height={80}
            quality={100}
            alt="Logo Floricultura"
          />
          <h2 className="mt-3 text-lg font-semibold text-gray-700 text-center">
            Junte-se a nós! 🌸
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Preencha os campos abaixo para criar sua conta e aproveitar nossas
            ofertas exclusivas.
          </p>
        </div>

        {/* Formulário de Cadastro */}
        <SignUpForm />
      </div>
    </div>
  );
};

export default Page;
