"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MyAccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className="flex flex-col items-center text-primary-foreground outline-none"
          onMouseEnter={() => setIsOpen(true)}
        >
          <AiOutlineUser className="text-2xl md:text-3xl" />
          <p>Minha conta</p>
        </DropdownMenuTrigger>

        {isOpen && (
          <DropdownMenuContent
            onMouseLeave={() => setIsOpen(false)}
            className="w-fit absolute top-full left-1/2 -translate-x-1/2 drop-shadow-md bg-primary text-primary-foreground rounded-md"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/registre-se")}
                className="font-semibold cursor-pointer text-nowrap hover:bg-primary-foreground hover:text-primary duration-100"
              >
                Criar uma conta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/login")}
                className="font-semibold cursor-pointer text-nowrap hover:bg-primary-foreground hover:text-primary duration-100"
              >
                Iniciar sessão
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};

export default MyAccountDropdown;
