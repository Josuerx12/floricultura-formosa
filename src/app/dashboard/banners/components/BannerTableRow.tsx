import ManageBannerDropdown from "@/components/dropdowns/manage-banner-dropdown";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

const BannerTableRow = ({ banner }: { banner: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TableRow key={banner.id}>
      <TableCell className="font-medium">{banner.id}</TableCell>
      <TableCell>{banner.title}</TableCell>
      <TableCell>{banner.is_active ? "Sim" : "Não"}</TableCell>
      <TableCell>{banner.created_at.toLocaleString("pt-BR")}</TableCell>
      <TableCell className="text-right">
        <ManageBannerDropdown
          banner={banner}
          handleOpen={() => setIsOpen((prev) => !prev)}
          isOpen={isOpen}
        />
      </TableCell>
    </TableRow>
  );
};

export default BannerTableRow;
