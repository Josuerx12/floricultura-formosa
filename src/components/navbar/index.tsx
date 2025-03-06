import { auth } from "@/lib/auth/auth";
import React from "react";
import NavbarDesktop from "./navbar-desktop";
import NavbarMobile from "./navbar-mobile";

const Navbar = async () => {
  const user = await auth();
  return (
    <>
      <NavbarDesktop user={user?.user} />
      <NavbarMobile user={user?.user} />
    </>
  );
};

export default Navbar;
