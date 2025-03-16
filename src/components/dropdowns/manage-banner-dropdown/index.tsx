"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, Settings2, Trash2 } from "lucide-react";
import DeleteCategoriaModal from "@/components/modals/category/delete";
import DetailCategoriaModal from "../../modals/category/detail";
import { Banner } from "@/lib/actions/banners";
import DeleteBannerModal from "@/components/modals/banners/delete";
import DetailBannerModal from "@/components/modals/banners/detail";

const ManageBannerDropdown = ({ banner }: { banner: Banner }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  return (
    <>
      <DeleteBannerModal
        isOpen={isDeleting}
        handleClose={() => setIsDeleting((prev) => !prev)}
        banner={banner}
      />
      <DetailBannerModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        banner={banner}
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
          <DropdownMenuItem
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          >
            Deletar <Trash2 />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ManageBannerDropdown;
