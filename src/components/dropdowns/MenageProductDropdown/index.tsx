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
import { DollarSign, Info, PackagePlus, Settings2, Trash2 } from "lucide-react";
import { Product } from "@/lib/actions/products";
import DeleteProductModal from "@/components/modals/product/delete";
import DetailProductModal from "@/components/modals/product/detail";
import { SubCategory } from "@/lib/actions/sub-category";
import { Category } from "@/lib/actions/category";
import { FaCartPlus } from "react-icons/fa";
import CreateOrderBumpModal from "@/components/modals/order-bumps/create-order-bump.modal";
import ListOrderBumpModal from "@/components/modals/order-bumps/list-order-bump.modal";

const ManageProductDropdown = ({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  const [isOrderBumpsShowing, setIsOrderBumpsShowing] = useState(false);
  const [isOrderBumpAdding, setIsOrderBumpAdding] = useState(false);
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
        categories={categories}
      />
      <CreateOrderBumpModal
        handleClose={() => setIsOrderBumpAdding((prev) => !prev)}
        isOpen={isOrderBumpAdding}
        product={product}
      />
      <ListOrderBumpModal
        handleClose={() => setIsOrderBumpsShowing((prev) => !prev)}
        isOpen={isOrderBumpsShowing}
        product={product}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="w-fit items-center gap-2 inline-flex  flex-grow-0 bg-secondary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
          Gerenciar <Settings2 size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Produto</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsOrderBumpAdding((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            Adicionar Order Bump <DollarSign />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsOrderBumpsShowing((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            Order Bumps <FaCartPlus />
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
