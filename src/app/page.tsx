import { singOutAction } from "@/lib/actions/auth";
import { auth, signOut } from "@/lib/auth/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const user = session?.user;
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {user?.image && (
        <Image
          src={user?.image}
          alt={`Avatar de ${user?.name}`}
          quality={100}
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
      <p>{user ? user.name : "Usuário não conectado!"}</p>
      {!user ? (
        <Link href={"/autentique-se"}>Ir Para login</Link>
      ) : (
        <form action={singOutAction}>
          <button
            type="submit"
            className="text-white bg-red-500 p-2 rounded-xl px-6 py-2"
          >
            Sair
          </button>
        </form>
      )}
    </main>
  );
}
