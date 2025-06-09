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
import { delivery_fee } from "@prisma/client";
import DeleteNeighborhoodModal from "@/components/modals/delivery-fee/delete";
import DetailNeighborhoodModal from "@/components/modals/delivery-fee/detail";

const ManageNeighborhoodDropdown = ({
  fee,
  handleOpen,
  isOpen,
}: {
  fee: delivery_fee;
  isOpen: boolean;
  handleOpen: VoidFunction;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletailing, setIsDeletailing] = useState(false);
  return (
    <>
      <DeleteNeighborhoodModal
        isOpen={isDeleting}
        handleClose={() => {
          setIsDeleting((prev) => !prev);
        }}
        fee={fee}
      />
      <DetailNeighborhoodModal
        isOpen={isDeletailing}
        handleClose={() => {
          setIsDeletailing((prev) => !prev);
        }}
        fee={fee}
      />
      <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
        <DropdownMenuTrigger>
          <Button variant={"outline"} onClick={handleOpen}>
            Gerenciar <Settings2 size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gerenciar Bairro / Taxa</DropdownMenuLabel>
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

export default ManageNeighborhoodDropdown;
