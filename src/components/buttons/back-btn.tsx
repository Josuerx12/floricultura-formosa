"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackBtn = () => {
  const router = useRouter();

  const handleBack = () => {
    if (
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin
    ) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      className="flex items-center bg-neutral-900 text-white p-2 rounded-full"
      onClick={handleBack}
    >
      <ChevronLeft size={26} /> <span>Voltar</span>
    </button>
  );
};

export default BackBtn;
