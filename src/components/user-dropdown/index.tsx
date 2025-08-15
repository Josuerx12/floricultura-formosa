"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import ProfileModal from "../modals/profile-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

const UserDropdown = ({ user }: { user: User }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen((prev) => !prev)}
        user={user}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="flex items-center gap-1">
            <img
              src={user.image ? user.image : "/no-profile.svg"}
              width={40}
              height={40}
              alt="profile pic"
              className="rounded-full"
            />
            <p className="max-w-20 text-sm line-clamp-1 text-primary-foreground font-semibold">
              {user.name}
            </p>
            <ChevronDown className="text-primary-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit  drop-shadow-md bg-primary text-primary-foreground rounded-md">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="font-semibold cursor-pointer text-nowrap hover:bg-primary-foreground hover:text-primary duration-100"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            Perfil
          </DropdownMenuItem>
          {(user?.role === "ADMIN" || user?.role === "SELLER") && (
            <DropdownMenuItem
              className="font-semibold cursor-pointer text-nowrap hover:bg-primary-foreground hover:text-primary duration-100"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="font-semibold cursor-pointer text-nowrap hover:bg-primary-foreground hover:text-primary duration-100"
            onClick={() => router.push("/compras")}
          >
            Compras
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="font-semibold cursor-pointer text-nowrap hover:bg-red-600 hover:text-primary duration-100"
          >
            <button className="w-full text-start" type="submit">
              Sair
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserDropdown;
