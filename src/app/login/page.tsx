import Logo from "@/components/logo";
import { signInWithCredentials, singInWithGoogle } from "@/lib/actions/auth";
import { auth } from "@/lib/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BiKey, BiMailSend } from "react-icons/bi";

const AutentiqueSe = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
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
          <h3 className="mt-2">Preencha seus dados para continuar!</h3>
        </div>

        <form
          className="flex flex-col gap-6 max-w-prose mx-auto w-full"
          action={signInWithCredentials}
        >
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiMailSend className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="email"
              name="email"
              placeholder="Insira seu e-mail cadastrado para se autenticar!"
            />
          </label>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BiKey className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="password"
              name="password"
              placeholder="Insira sua senha para se autenticar!"
            />
          </label>
          <button
            type="submit"
            className="border border-primary-foreground hover:bg-primary-foreground duration-200 hover:text-primary py-1 w-fit px-6 rounded-full mx-auto"
          >
            Fazer login
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <p className="mx-auto font-light">
            Não possui uma conta?{" "}
            <Link className="text-blue-600" href={"/registre-se"}>
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
                className="flex bg-slate-200/90 hover:bg-slate-300 duration-200 rounded-full px-6 py-1 justify-center items-center gap-2"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutentiqueSe;
