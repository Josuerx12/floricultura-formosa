"use client";
import Logo from "../../logo";

import Link from "next/link";
import UserDropdown from "../../user-dropdown";
import CategoryDropdown from "@/components/dropdowns/category-dropdown";
import { prisma } from "@/lib/db/prisma";
import CartBtn from "@/components/buttons/cart-btn";
import MyAccountDropdown from "@/components/dropdowns/my-account-dropdown";
import HomeSearchFilter from "@/components/filters/home-search-filter";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/actions/category";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const NavbarDesktop = () => {
  const session = useSession();
  const user = session?.data?.user;

  const { data, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/dashboard");

  if (hideNavbar) return null;

  return (
    <div className="md:flex flex-col sticky z-20 inset-0">
      <header className="bg-primary drop-shadow  md:flex hidden justify-between items-center gap-10 py-6 px-4 sm:px-10 md:px-10 lg:px-20">
        <HomeSearchFilter />

        <Link href={"/"}>
          <Logo />
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <CartBtn />

            {user && <UserDropdown user={user} />}
          </div>
        ) : (
          <div className="flex gap-6 text-sm items-center">
            <CartBtn />
            <MyAccountDropdown />
          </div>
        )}
      </header>
      <nav className="bg-primary-foreground text-primary hidden md:flex gap-6 px-4 py-2 justify-center items-center">
        <ul className="flex gap-10 text-sm uppercase">
          <li>
            {isPending && <div>Carregando Categorias...</div>}
            {data && <CategoryDropdown categories={data} />}
          </li>
          <Link href={"/ofertas"}>
            <li className=" relative before:absolute before:w-0 before:h-[2px] before:left-0 before:-bottom-1 hover:before:w-10/12 before:bg-primary-foreground  before:duration-200 cursor-pointer">
              Ofertas
            </li>
          </Link>
          <Link href={"/ajuda"}>
            <li className=" relative before:absolute before:w-0 before:h-[2px] before:left-0 before:-bottom-1 hover:before:w-10/12 before:bg-primary-foreground  before:duration-200 cursor-pointer">
              Ajuda
            </li>
          </Link>
        </ul>
      </nav>
    </div>
  );
};

export default NavbarDesktop;
