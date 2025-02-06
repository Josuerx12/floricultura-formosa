import React from "react";
import { BiKey, BiMailSend, BiSolidPhone, BiSolidUser } from "react-icons/bi";
import Image from "next/image";
import { signUp } from "@/lib/actions/auth";
import Link from "next/link";
import SignUpForm from "./form";

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center ">
      <div className="flex flex-col gap-6 mx-2 md:mx-auto p-3 py-7 max-w-screen-md h-fit border border-primary mt-40 flex-1 rounded-xl">
        <div className="flex flex-col  items-center w-full mx-auto">
          <Image
            src={"/logo.svg"}
            width={70}
            height={70}
            quality={100}
            alt="Logo floricultura"
            className="bg-transparent fill-current text-black"
          />

          <h3 className="mt-2">Preencha seus dados para criar sua conta!</h3>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
};

export default Page;
