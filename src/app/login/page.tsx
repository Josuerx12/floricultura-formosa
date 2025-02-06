import { signInWithCredentials, singInWithGoogle } from "@/lib/actions/auth";
import { auth } from "@/lib/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BiKey,
  BiLogoGoogle,
  BiLogoGooglePlus,
  BiMailSend,
} from "react-icons/bi";
import LoginForm from "./form";

const AutentiqueSe = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full h-screen flex justify-center ">
      <div className="flex flex-col gap-6 mx-2 md:mx-auto p-3 py-7 max-w-screen-md h-fit border border-primary mt-40 flex-1 rounded-xl">
        <div className="flex flex-col  items-center w-full mx-auto">
          <Image
            src={"/logo.svg"}
            width={70}
            height={70}
            quality={100}
            alt="Logo floricultura"
            className=""
          />

          <h3 className="mt-2">Preencha seus dados para autenticar-se!</h3>
        </div>

        <LoginForm />

        <div className="flex flex-col gap-2">
          <p className="mx-auto font-light text-sm">
            Não possui uma conta?{" "}
            <Link className="text-blue-600" href={"/registre-se"}>
              clique aqui!
            </Link>
          </p>
          <p className="text-sm mx-auto font-light">
            Ou se preferir autentique-se com
          </p>
          <div className="flex flex-wrap gap-4 mx-auto">
            <form action={singInWithGoogle}>
              <button
                type="submit"
                className="flex bg-[#DB4437] duration-200 text-sm rounded p-2 text-white justify-center items-center gap-2"
              >
                <BiLogoGooglePlus size={18} /> Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutentiqueSe;
