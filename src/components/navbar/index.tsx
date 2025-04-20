import { auth } from "@/lib/auth/auth";
import React from "react";
import NavbarMobile from "./navbar-mobile";
import Image from "next/image";
import { ListAllFlowerMeanings } from "@/lib/actions/flower-meaning/infraestructure/actions/list-all";

const Navbar = async () => {
  const user = await auth();
  const meanings = await ListAllFlowerMeanings();
  return (
    <>
      <NavbarMobile user={user?.user} meanings={meanings} />
    </>
  );
};

export default Navbar;
