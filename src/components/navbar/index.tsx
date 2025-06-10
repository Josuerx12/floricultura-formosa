import { auth } from "@/lib/auth/auth";
import React from "react";
import NavbarMobile from "./navbar-mobile";
import Image from "next/image";
import { ListAllFlowerMeanings } from "@/lib/actions/flower-meaning/infraestructure/actions/list-all";
import CompleteRegisterFloatComponent from "../complete-register-float/CompleteRegisterFloatComponent";

const Navbar = async () => {
  const user = await auth();
  return (
    <>
      <NavbarMobile user={user?.user} />
      <CompleteRegisterFloatComponent user={user?.user} />
    </>
  );
};

export default Navbar;
