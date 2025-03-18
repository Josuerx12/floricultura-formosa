"use client";

import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { singOutAction } from "@/lib/actions/auth";
import { usePathname, useRouter } from "next/navigation";
import ProfileModal from "@/components/modals/profile-modal";
import CategoryDropdown from "@/components/dropdowns/category-dropdown";
import { getCategories } from "@/lib/actions/category";
import CartBtn from "@/components/buttons/cart-btn";
import { MobileHomeSearchFilter } from "@/components/filters/mobile-home-search-filter";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

const NavbarMobile = ({ user }: { user?: User }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  const { data, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/dashboard");

  if (hideNavbar) return null;

  return (
    <>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen((prev) => !prev)}
        user={user as any}
      />
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <div className="sticky inset-0 z-30">
        <header className="bg-primary-hard_pink  flex  justify-between items-center gap-2 py-6 px-4 md:px-20 ">
          <button onClick={handleOpen} className=" text-primary p-1 rounded">
            {isOpen ? (
              <div className="flex items-center gap-2 font-medium text-primary">
                <X />
                Fechar
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium text-primary">
                <Menu /> Menu
              </div>
            )}
          </button>
          <div className="flex items-center gap-4">
            <MobileHomeSearchFilter />
            <div className=" p-2 rounded-full">
              <CartBtn />
            </div>
          </div>
        </header>
      </div>

      <div
        className={`fixed h-full ${
          isOpen ? "left-0" : "-left-full"
        } max-w-[400px]  w-full p-5 duration-200 top-0 ease-linear bg-primary z-20 flex items-start pt-40 justify-center`}
      >
        <ul className="flex w-full flex-col gap-y-5 text-primary-foreground text-sm font-semibold uppercase">
          {user ? (
            <>
              <li
                onClick={() => {
                  handleOpen();
                  router.push("/");
                }}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-primary-soft_pink p-2 rounded-md"
              >
                Pagina inicial <Home size={18} />
              </li>
              <li
                onClick={() => {
                  handleOpen();
                }}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-primary-soft_pink p-2 rounded-md"
              >
                {isPending && <div>Carregando Categorias...</div>}
                {data && <CategoryDropdown categories={data} />}
              </li>
              <li
                onClick={() => {
                  handleOpen();
                  setIsProfileOpen((prev) => !prev);
                }}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-primary-soft_pink p-2 rounded-md"
              >
                Perfil <UserIcon size={18} />
              </li>
              <li
                onClick={() => {
                  handleOpen();
                  router.push("/dashboard");
                }}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-primary-soft_pink p-2 rounded-md"
              >
                Dashboard <LayoutDashboard size={18} />
              </li>
              <li
                onClick={handleOpen}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-primary-soft_pink p-2 rounded-md"
              >
                Compras <ShoppingCart size={18} />
              </li>
              <li onClick={handleOpen}>
                <form className="w-full" action={singOutAction}>
                  <button
                    className="flex w-full bg-red-600 uppercase text-white p-2 rounded items-center justify-between gap-2"
                    type="submit"
                  >
                    Desconectar <LogOut size={18} />
                  </button>
                </form>
              </li>
            </>
          ) : (
            <>
              <Link
                onClick={handleOpen}
                className="font-semibold text-sm flex w-full items-center justify-between gap-2 text-primary-foreground hover:text-primary-foreground/80 duration-200"
                title="Cadastre-se para poder realizar suas compras!"
                href={"/registre-se"}
              >
                Registre-se <UserPlus />
              </Link>
              <Link
                onClick={handleOpen}
                title="Autentique-se para poder realizar suas compras"
                className="border text-sm flex items-center justify-between gap-2 cursor-pointer  p-2 rounded-md  text-primary-foreground hover:bg-primary-foreground hover:text-primary duration-200"
                href={"/login"}
              >
                Login <LogIn />
              </Link>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default NavbarMobile;
