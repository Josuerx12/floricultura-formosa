import { auth } from "@/lib/auth/auth";
import React from "react";
import NavbarMobile from "./navbar-mobile";
import Image from "next/image";

const Navbar = async () => {
  const user = await auth();
  return (
    <>
      <NavbarMobile user={user?.user} />
    </>
  );
};

export default Navbar;
