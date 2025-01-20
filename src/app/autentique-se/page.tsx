import { signInWithCredentials, singInWithGoogle } from "@/lib/actions/auth";
import { auth } from "@/lib/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BiKey, BiMailSend } from "react-icons/bi";
import { FaApple } from "react-icons/fa";
import { GiFlowerEmblem } from "react-icons/gi";

const AutentiqueSe = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-6 mx-auto p-3 max-w-screen-md border flex-1 rounded-xl">
        <div className="flex flex-col  items-center w-full mx-auto">
          <h2 className="flex items-center text-3xl gap-4 mb-3 font-semibold">
            <GiFlowerEmblem className="text-pink-400" /> Floricultura Formosa{" "}
            <GiFlowerEmblem className="text-pink-400" />
          </h2>
          <h3 className="">Preencha seus dados para continuar!</h3>
        </div>

        <form
          className="flex flex-col gap-4 max-w-prose mx-auto w-full"
          action={signInWithCredentials}
        >
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiMailSend className="text-neutral-700" size={24} />
            <input
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="email"
              name="email"
              placeholder="Insira seu e-mail cadastrado para se autenticar!"
            />
          </label>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiKey className="text-neutral-700" size={24} />
            <input
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="password"
              name="password"
              placeholder="Insira sua senha para se autenticar!"
            />
          </label>
          <button
            type="submit"
            className="border border-neutral-800 py-1 w-fit px-6 rounded-full mx-auto"
          >
            Fazer login
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <p className="mx-auto font-light">
            Não possui uma conta?{" "}
            <Link className="text-blue-600" href={"/registrar-se"}>
              clique aqui!
            </Link>
          </p>
          <p className="text-sm mx-auto font-light">
            Ou se preferir autentique-se por
          </p>
          <div className="flex flex-wrap gap-4 mx-auto">
            <form action={singInWithGoogle}>
              <button
                type="submit"
                className="flex bg-slate-300/90 rounded-full px-6 py-1 justify-center items-center gap-2"
              >
                Fazer login com
                <Image
                  src={"images/google.svg"}
                  width={32}
                  height={32}
                  quality={100}
                  alt="Google icon"
                />
              </button>
            </form>
            <form action="">
              <button
                type="submit"
                className="flex bg-neutral-950 text-white rounded-full px-6 py-1 justify-center items-center gap-2"
              >
                Fazer login com
                <FaApple size={32} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutentiqueSe;
