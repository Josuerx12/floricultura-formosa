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
import { DollarSign, Info, Settings2, Trash2 } from "lucide-react";
import DeleteCategoriaModal from "@/components/modals/category/delete";
import { Category } from "@/lib/actions/category";
import DetailCategoriaModal from "../../modals/category/detail";
import CreateOrderBumpModal from "@/components/modals/order-bumps/create-order-bump.modal";
import ListOrderBumpModal from "@/components/modals/order-bumps/list-order-bump.modal";
import { FaCartPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const ManageCategoryDropdown = ({
  category,
  handleOpen,
  isOpen,
}: {
  category: Category;
  isOpen: boolean;
  handleOpen: VoidFunction;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  const [isOrderBumpsShowing, setIsOrderBumpsShowing] = useState(false);
  const [isOrderBumpAdding, setIsOrderBumpAdding] = useState(false);
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
      <CreateOrderBumpModal
        handleClose={() => setIsOrderBumpAdding((prev) => !prev)}
        isOpen={isOrderBumpAdding}
        category={category}
      />
      <ListOrderBumpModal
        handleClose={() => setIsOrderBumpsShowing((prev) => !prev)}
        isOpen={isOrderBumpsShowing}
        category={category}
      />
      <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
        <DropdownMenuTrigger>
          <Button variant={"outline"} onClick={handleOpen}>
            Gerenciar <Settings2 size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Categoria</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsOrderBumpAdding((prev) => !prev);
              handleOpen();
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            Adicionar Order Bump <DollarSign />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOrderBumpsShowing((prev) => !prev);
              handleOpen();
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            Order Bumps <FaCartPlus />
          </DropdownMenuItem>
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

export default ManageCategoryDropdown;
