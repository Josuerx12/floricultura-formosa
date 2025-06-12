"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import ManageProductDropdown from "@/components/dropdowns/MenageProductDropdown";
import { useState } from "react";
const ProductTableRow = ({ prod }: { prod: any }) => {
  const [isManaging, setIsManaging] = useState(false);

  return (
    <TableRow key={prod.id}>
      <TableCell className="font-medium">
        <img
          className="w-[50px] h-[50px]"
          src={
            prod?.product_images[0]?.url
              ? prod.product_images[0].url
              : "/no-profile.svg"
          }
          alt="Product image"
          width={100}
          height={100}
        />
      </TableCell>
      <TableCell>{prod.name}</TableCell>
      <TableCell>{prod.subcategory.name}</TableCell>
      <TableCell>{prod.stock_quantity} UN</TableCell>
      <TableCell>
        {prod.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
      <TableCell>{prod.created_at.toLocaleString("pt-BR")}</TableCell>
      <TableCell className="text-right">
        <ManageProductDropdown
          product={prod}
          handleOpen={() => setIsManaging((prev) => !prev)}
          isOpen={isManaging}
        />
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
