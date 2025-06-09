"use client";
import ManageCategoryDropdown from "@/components/dropdowns/MenageCategoryDropdown";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

const CategoriesTableRow = ({ category }: { category: any }) => {
  const [isManaging, setIsManaging] = useState(false);

  return (
    <TableRow key={category.id}>
      <TableCell className="font-medium">{category.id}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.created_at.toLocaleString("pt-BR")}</TableCell>
      <TableCell className="text-right">
        <ManageCategoryDropdown
          category={category}
          isOpen={isManaging}
          handleOpen={() => setIsManaging((prev) => !prev)}
        />
      </TableCell>
    </TableRow>
  );
};

export default CategoriesTableRow;
