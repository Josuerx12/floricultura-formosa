import React from "react";
import { BiKey, BiMailSend, BiSolidPhone, BiSolidUser } from "react-icons/bi";
import Image from "next/image";
import { signUp } from "@/lib/actions/auth";
import Link from "next/link";

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center ">
      <div className="flex flex-col gap-6 mx-2 md:mx-auto p-3 py-7 max-w-screen-md h-fit border border-primary mt-40 flex-1 rounded-xl">
        <div className="flex flex-col  items-center w-full mx-auto">
          <div className="flex items-center text-center text-3xl gap-2 mb-3 font-semibold">
            <Image
              src={"/logo.svg"}
              width={35}
              height={35}
              quality={100}
              alt="Logo floricultura"
              className="bg-transparent fill-current text-black"
            />
            <h2>Floricultura Formosa</h2>
            <Image
              src={"/logo.svg"}
              width={35}
              height={35}
              quality={100}
              alt="Logo floricultura"
              className="bg-transparent fill-current text-black"
            />
          </div>
          <h3 className="mt-2">Preencha seus dados para criar sua conta!</h3>
        </div>

        <form
          className="flex flex-col gap-6 max-w-prose mx-auto w-full"
          action={signUp}
        >
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiSolidUser className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              name="name"
              placeholder="Insira seu nome para criar uma conta!"
            />
          </label>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiMailSend className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="email"
              name="email"
              placeholder="Insira seu e-mail para criar uma conta!"
            />
          </label>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiSolidPhone className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="tel"
              name="phone"
              placeholder="Insira seu numero de telefone para criar uma conta!"
            />
          </label>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiKey className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="password"
              name="password"
              placeholder="Insira uma senha para criar uma conta!"
            />
          </label>

          <p className="text-sm text-center">
            Já possui uma conta? Vá até a pagina de login e autentique-se! Ou{" "}
            <Link href={"/login"} className="text-blue-500">
              clique aqui!
            </Link>
          </p>

          <button
            type="submit"
            className="border border-primary-foreground hover:bg-primary-foreground duration-200 hover:text-primary py-1 w-fit px-6 rounded-full mx-auto"
          >
            Fazer Cadastro
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
