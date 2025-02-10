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
import { Info, PackagePlus, Settings2, Trash2 } from "lucide-react";
import { Product } from "@/lib/actions/products";
import DeleteProductModal from "@/components/modals/product/delete";

const ManageProductDropdown = ({ product }: { product: Product }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  return (
    <>
      <DeleteProductModal
        isOpen={isDeleting}
        handleClose={() => setIsDeleting((prev) => !prev)}
        product={product}
      />
      {/* <DetailCategoriaModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        category={category}
      /> */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-fit items-center gap-2 inline-flex  flex-grow-0 bg-secondary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
          Gerenciar <Settings2 size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Produto</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDeletailing((prev) => !prev)}
          >
            Adicionar ao estoque <PackagePlus />
          </DropdownMenuItem>
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

export default ManageProductDropdown;
