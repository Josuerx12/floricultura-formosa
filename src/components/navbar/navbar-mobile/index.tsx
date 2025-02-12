"use client";
import { useSession } from "next-auth/react";
import Logo from "../../logo";

import Link from "next/link";
import UserDropdown from "../../user-dropdown";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { singOutAction } from "@/lib/actions/auth";

const NavbarMobile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <div className="sticky inset-0 z-20">
        <header className="bg-primary flex md:hidden justify-between items-center gap-2 py-6 px-4 md:px-20 ">
          <Link href={"/"}>
            <Logo />
          </Link>

          <div className="flex items-center gap-4">
            <div className="bg-primary-foreground p-2 rounded-full">
              <ShoppingCart size={16} className="text-primary" />
            </div>
            <button
              onClick={handleOpen}
              className="bg-primary-foreground text-primary p-1 rounded"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        <nav className="bg-primary-foreground text-white">
          <ul className="flex items-center justify-between w-full p-2 text-sm tracking-wide">
            <li>Ocasiões</li>
            <li>Categorias</li>
            <li>Ofertas</li>
            <li>Ajuda</li>
          </ul>
        </nav>
      </div>

      <div
        className={`fixed h-full ${
          isOpen ? "right-0" : "-right-full"
        } w-fit p-5 duration-200 top-0 ease-linear bg-primary z-10 flex items-start pt-40 justify-center`}
      >
        <ul className="flex flex-col gap-y-5 text-primary-foreground font-semibold">
          {user ? (
            <>
              <li className="flex items-center justify-between gap-6">
                Perfil <User />
              </li>
              <li className="flex items-center justify-between gap-6">
                Dashboard <LayoutDashboard />
              </li>
              <li className="flex items-center justify-between gap-6">
                Compras <ShoppingCart />
              </li>
              <li className="">
                <form className="w-full" action={singOutAction}>
                  <button
                    className="flex w-full items-center justify-between gap-6"
                    type="submit"
                  >
                    Sair <LogOut />
                  </button>
                </form>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default NavbarMobile;
