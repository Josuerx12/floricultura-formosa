import { singInWithGoogle } from "@/lib/actions/auth";
import { auth } from "@/lib/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BiLogoGooglePlus } from "react-icons/bi";
import LoginForm from "./form";

const AutentiqueSe = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full h-full md:h-screen flex justify-center py-10 ">
      <div className="flex flex-col h-fit gap-6 mx-4 md:mx-auto p-6 py-8 max-w-md w-full bg-white shadow-lg rounded-2xl border border-gray-200">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src="/logo.svg" width={80} height={80} alt="Logo Floricultura" />
          <h2 className="mt-3 text-lg text-center font-semibold text-gray-700">
            Bem-vindo à nossa floricultura!
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <LoginForm />

        {/* Alternativas de Login */}
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-gray-600">
            Não possui uma conta?{" "}
            <Link
              className="text-[#E8485F] font-medium hover:underline"
              href="/registre-se"
            >
              Registre-se
            </Link>
          </p>

          <div className="relative flex items-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-sm text-gray-400 bg-white">ou</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <form action={singInWithGoogle} className="w-full">
            <button
              type="submit"
              className="flex items-center gap-3 justify-center w-full py-2 px-4 bg-[#E8485F] text-white text-sm font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-[#d73850] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E8485F] focus:ring-offset-1"
            >
              <BiLogoGooglePlus size={20} />
              Entrar com Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AutentiqueSe;
