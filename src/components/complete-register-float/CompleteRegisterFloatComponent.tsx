import React from "react";
import CompleteRegister from "../modals/complete-register/CompleteRegister";
import { AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { User } from "next-auth";

const CompleteRegisterFloatComponent = async ({ user }: { user?: User }) => {
  if (!user) return null;
  if (user.document && user.birthdate && user.phone) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-primary-soft_pink border border-primary-hard_pink shadow-lg rounded-lg px-3 py-2 animate-fade-in
      max-w-xs sm:max-w-sm w-[90vw] sm:w-auto
      sm:bottom-6 sm:left-6
      "
    >
      <AlertTriangle
        className="text-primary-hard_pink flex-shrink-0"
        size={22}
      />
      <div className="flex flex-col text-left flex-1">
        <span className="font-semibold text-title text-sm leading-tight">
          Complete seu cadastro
        </span>
        <span className="text-price text-xs leading-tight">
          Para finalizar sua compra, complete seu cadastro.
        </span>
        <div className="mt-1">
          <CompleteRegister />
        </div>
      </div>
    </div>
  );
};

export default CompleteRegisterFloatComponent;
