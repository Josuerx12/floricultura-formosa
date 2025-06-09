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
  handleOpen,
  isOpen,
}: {
  subCategory: SubCategory;
  isOpen: boolean;
  handleOpen: VoidFunction;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  return (
    <>
      <DeleteSubCategoriaModal
        isOpen={isDeleting}
        handleClose={() => {
          setIsDeleting((prev) => !prev);
        }}
        subCategory={subCategory}
      />
      <DetailSubCategoriaModal
        isOpen={isDeletailing}
        handleClose={() => {
          setIsDeletailing((prev) => !prev);
        }}
        subCategory={subCategory}
      />
      <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
        <DropdownMenuTrigger>
          <Button variant={"outline"} onClick={handleOpen}>
            Gerenciar <Settings2 size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Sub Categoria</DropdownMenuLabel>
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
          <DropdownMenuItem
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              setIsDeleting((prev) => !prev);
              handleOpen();
            }}
          >
            Deletar <Trash2 />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ManageSubCategoryDropdown;
