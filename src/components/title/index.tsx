import React, { ReactNode } from "react";
import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <h2
      className={`${playfairDisplay.className} text-lg text-body_foreground md:text-2xl font-bold text-center my-6 uppercase`}
    >
      {children}
    </h2>
  );
};

export default Title;
