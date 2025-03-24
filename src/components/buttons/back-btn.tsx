"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

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
    <Button onClick={handleBack}>
      <ChevronLeft size={26} /> <span>Voltar</span>
    </Button>
  );
};

export default BackBtn;
