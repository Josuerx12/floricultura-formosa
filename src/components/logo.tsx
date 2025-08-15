import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center  font-semibold ">
      <img
        src={"/logo.svg"}
        width={60}
        height={60}
        alt="Logo floricultura"
        className="bg-transparent fill-current w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-black"
      />
      <h2 className="text-primary-foreground text-sm text-center hidden md:block text-nowrap">
        Floricultura Formosa
      </h2>
    </div>
  );
};

export default Logo;
