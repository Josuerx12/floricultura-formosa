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
import { Product } from "@/lib/actions/products";
import DeleteProductModal from "@/components/modals/product/delete";
import DetailProductModal from "@/components/modals/product/detail";
import { Button } from "@/components/ui/button";

const ManageProductDropdown = ({
  product,
  handleOpen,
  isOpen,
}: {
  product: Product;
  isOpen: boolean;
  handleOpen: VoidFunction;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);

  return (
    <>
      <DeleteProductModal
        isOpen={isDeleting}
        handleClose={() => setIsDeleting((prev) => !prev)}
        product={product}
      />
      <DetailProductModal
        isOpen={isDeletailing}
        handleClose={() => setIsDeletailing((prev) => !prev)}
        product={product}
      />

      <DropdownMenu open={isOpen} onOpenChange={handleOpen} key={product.id}>
        <DropdownMenuTrigger>
          <Button variant={"outline"} onClick={handleOpen}>
            Gerenciar <Settings2 size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Produto</DropdownMenuLabel>
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

export default ManageProductDropdown;
