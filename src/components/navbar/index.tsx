import { auth } from "@/lib/auth/auth";
import Logo from "../logo";
import Image from "next/image";
import Link from "next/link";

const NavbarDesktop = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-primary md:flex hidden justify-between items-center gap-2 py-6 px-4 md:px-20">
      <Link href={"/"}>
        <Logo />
      </Link>

      <nav>
        <ul className="flex gap-6 text-sm ">
          <li className="text-primary-foreground  relative before:absolute before:w-0 before:h-[2px] before:left-0 before:-bottom-1 hover:before:w-10/12 before:bg-primary-foreground  before:duration-200 cursor-pointer">
            Ocasiões
          </li>
          <li className="text-primary-foreground relative before:absolute before:w-0 before:h-[2px] before:left-0 before:-bottom-1 hover:before:w-10/12 before:bg-primary-foreground  before:duration-200 cursor-pointer">
            Categorias
          </li>
          <li className="text-primary-foreground relative before:absolute before:w-0 before:h-[2px] before:left-0 before:-bottom-1 hover:before:w-10/12 before:bg-primary-foreground  before:duration-200 cursor-pointer">
            Ofertas
          </li>
          <li className="text-primary-foreground relative before:absolute before:w-0 before:h-[2px] before:left-0 before:-bottom-1 hover:before:w-10/12 before:bg-primary-foreground  before:duration-200 cursor-pointer">
            Ajuda
          </li>
        </ul>
      </nav>

      {user ? (
        <div className="flex items-center gap-2">
          <Image
            src={user.image ? user.image : "/no-profile.svg"}
            width={32}
            height={32}
            quality={100}
            alt="profile pic"
            className="rounded-full"
          />
          <p className="max-w-20 text-sm line-clamp-1 text-primary-foreground font-semibold">
            {user.name}
          </p>
        </div>
      ) : (
        <div className="flex gap-4 text-sm items-center">
          <Link
            className="font-semibold text-primary-foreground hover:text-primary-foreground/80 duration-200"
            title="Cadastre-se para poder realizar suas compras!"
            href={"/registre-se"}
          >
            Registre-se
          </Link>
          <Link
            title="Autentique-se para poder realizar suas compras"
            className="border border-primary-foreground text-primary-foreground rounded-md px-3 py-1 hover:bg-primary-foreground hover:text-primary duration-200"
            href={"/login"}
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default NavbarDesktop;
