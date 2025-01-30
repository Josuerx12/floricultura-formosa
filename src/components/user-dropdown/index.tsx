"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { singOutAction } from "@/lib/actions/auth";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import ProfileModal from "../modals/profile-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";

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
            <Image
              src={user.image ? user.image : "/no-profile.svg"}
              width={32}
              height={32}
              quality={100}
              alt="profile pic"
              className="rounded-full"
            />
            <p className="max-w-20 text-sm line-clamp-1 text-primary-foreground font-semibold">
              {user.name}
            </p>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsProfileOpen((prev) => !prev)}>
            Perfil
          </DropdownMenuItem>
          {(user?.role === "ADMIN" || user?.role === "SELLER") && (
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => router.push("/compras")}>
            Compras
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form className="w-full" action={singOutAction}>
              <button className="w-full text-start" type="submit">
                Sair
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserDropdown;
