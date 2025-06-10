import { auth } from "@/lib/auth/auth";
import React from "react";
import NavbarMobile from "./navbar-mobile";

const Navbar = async () => {
  const user = await auth();
  return (
    <>
      <NavbarMobile user={user?.user} />
    </>
  );
};

export default Navbar;
