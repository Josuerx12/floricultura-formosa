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
import { Button } from "@/components/ui/button";
import DeleteCategoriaModal from "@/components/modals/category/delete";
import { Category } from "@/lib/actions/category";
import DetailCategoriaModal from "../../modals/category/detail";

const ManageCategoryDropdown = ({ category }: { category: Category }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  return (
    <>
      <DeleteCategoriaModal
        isOpen={isDeleting}
        handleClose={() => setIsDeleting((prev) => !prev)}
        category={category}
      />
      <DetailCategoriaModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        category={category}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="w-fit items-center gap-2 inline-flex  flex-grow-0 bg-secondary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
          Gerenciar <Settings2 size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Categoria</DropdownMenuLabel>
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

export default ManageCategoryDropdown;
