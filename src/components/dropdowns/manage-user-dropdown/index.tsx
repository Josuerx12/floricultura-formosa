import UserDetailsModal from "@/components/modals/user/details";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, Settings2 } from "lucide-react";
import { User } from "next-auth";
import React, { useState } from "react";

const ManageUserDropdown = ({
  user,
  handleOpen,
  isOpen,
}: {
  user: User & { createdAt: Date };
  isOpen: boolean;
  handleOpen: VoidFunction;
}) => {
  const [isDeletailing, setIsDeletailing] = useState(false);

  return (
    <>
      <UserDetailsModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        user={user}
      />
      <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
        <DropdownMenuTrigger>
          <Button onClick={handleOpen} variant={"outline"}>
            Gerenciar <Settings2 size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Usuário</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              setIsDeletailing((prev) => !prev);
              handleOpen();
            }}
          >
            Detalhes <Info />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ManageUserDropdown;
