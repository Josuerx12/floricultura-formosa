"use client";
import { useSession } from "next-auth/react";
import Logo from "../../logo";

import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { singOutAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import ProfileModal from "@/components/modals/profile-modal";
import CategoryDropdown from "@/components/dropdowns/category-dropdown";
import { Category, getCategories } from "@/lib/actions/category";
import CartBtn from "@/components/buttons/cart-btn";

const NavbarMobile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategoires() {
    const res = await getCategories();

    setCategories(res);
  }

  useEffect(() => {
    fetchCategoires();
  }, []);

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
        <header className="bg-primary flex md:hidden justify-between items-center gap-2 py-6 px-4 md:px-20 ">
          <Link href={"/"}>
            <Logo />
          </Link>

          <div className="flex items-center gap-4">
            <div className=" p-2 rounded-full">
              <CartBtn />
            </div>
            <button
              onClick={handleOpen}
              className=" text-primary-foreground p-1 rounded"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        <nav className="md:hidden bg-primary-foreground text-white uppercase">
          <ul className="flex items-center justify-between w-full px-4 py-2 text-sm tracking-wide">
            <li>
              <CategoryDropdown categories={categories} />
            </li>
            <li>
              <Link href={"/ofertas"}>Ofertas</Link>
            </li>
            <li>
              <Link href={"/ajuda"}>Ajuda</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div
        className={`fixed h-full ${
          isOpen ? "right-0" : "-right-full"
        } max-w-[200px] w-full p-5 duration-200 top-0 ease-linear bg-primary z-20 flex items-start pt-40 justify-center`}
      >
        <ul className="flex w-full flex-col gap-y-5 text-primary-foreground text-sm font-semibold">
          {user ? (
            <>
              <li
                onClick={() => {
                  handleOpen();
                  setIsProfileOpen((prev) => !prev);
                }}
                className="flex items-center justify-between gap-2"
              >
                Perfil <User size={18} />
              </li>
              <li
                onClick={() => {
                  handleOpen();
                  router.push("/dashboard/metricas");
                }}
                className="flex items-center justify-between gap-2"
              >
                Dashboard <LayoutDashboard size={18} />
              </li>
              <li
                onClick={handleOpen}
                className="flex items-center justify-between gap-2"
              >
                Compras <ShoppingCart size={18} />
              </li>
              <li onClick={handleOpen}>
                <form className="w-full" action={singOutAction}>
                  <button
                    className="flex w-full bg-red-600 text-white p-2 rounded items-center justify-between gap-2"
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
                className="border text-sm flex items-center justify-between gap-2  text-primary-foreground hover:bg-primary-foreground hover:text-primary duration-200"
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
