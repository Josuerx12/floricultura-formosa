import UserDetailsModal from "@/components/modals/user/details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, Settings2, Trash2 } from "lucide-react";
import { User } from "next-auth";
import React, { useState } from "react";

const ManageUserDropdown = ({ user }: { user: User & { createdAt: Date } }) => {
  const [isDeletailing, setIsDeletailing] = useState(false);

  return (
    <>
      <UserDetailsModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        user={user}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="w-fit items-center gap-2 inline-flex  flex-grow-0 bg-secondary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
          Gerenciar <Settings2 size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Banner</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDeletailing((prev) => !prev)}
          >
            Detalhes <Info />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ManageUserDropdown;
