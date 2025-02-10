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
import DeleteSubCategoriaModal from "@/components/modals/subcategory/delete";
import { SubCategory } from "@/lib/actions/sub-category";
import DetailSubCategoriaModal from "@/components/modals/subcategory/detail";

const ManageSubCategoryDropdown = ({
  subCategory,
}: {
  subCategory: SubCategory;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  return (
    <>
      <DeleteSubCategoriaModal
        isOpen={isDeleting}
        handleClose={() => setIsDeleting((prev) => !prev)}
        subCategory={subCategory}
      />
      <DetailSubCategoriaModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        subCategory={subCategory}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="w-fit items-center gap-2 inline-flex  flex-grow-0 bg-secondary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
          Gerenciar <Settings2 size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Sub Categoria</DropdownMenuLabel>
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

export default ManageSubCategoryDropdown;
