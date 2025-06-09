"use client";
import ManageSubCategoryDropdown from "@/components/dropdowns/MenageSubCategoryDropdown";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

const SubCategoriesTableRow = ({ subCategory }: { subCategory: any }) => {
  const [isManaging, setIsManaging] = useState(false);
  return (
    <TableRow key={subCategory.id}>
      <TableCell className="font-medium">{subCategory.id}</TableCell>
      <TableCell>{subCategory.name}</TableCell>
      <TableCell>{subCategory.category.name}</TableCell>
      <TableCell>{subCategory.created_at.toLocaleString("pt-BR")}</TableCell>
      <TableCell className="text-right">
        <ManageSubCategoryDropdown
          subCategory={subCategory as any}
          isOpen={isManaging}
          handleOpen={() => setIsManaging((prev) => !prev)}
        />
      </TableCell>
    </TableRow>
  );
};

export default SubCategoriesTableRow;
