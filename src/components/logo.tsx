import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center  font-semibold ">
      <Image
        src={"/logo.svg"}
        width={60}
        height={60}
        quality={100}
        alt="Logo floricultura"
        className="bg-transparent fill-current w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-black"
      />
      <h2 className="text-primary-foreground text-sm text-center hidden md:block">
        Floricultura Formosa
      </h2>
    </div>
  );
};

export default Logo;
