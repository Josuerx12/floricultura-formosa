import ManageNeighborhoodDropdown from "@/components/dropdowns/MenageNeighborhoodDropdown";
import { TableCell, TableRow } from "@/components/ui/table";
import { delivery_fee } from "@prisma/client";
import React, { useState } from "react";

const NeighborhoodTableRow = ({ fee }: { fee: delivery_fee }) => {
  const [isMenaging, setIsMenaging] = useState(false);

  return (
    <TableRow key={fee.id}>
      <TableCell className="font-medium">{fee.id}</TableCell>
      <TableCell>{fee.district}</TableCell>
      <TableCell>
        {fee.fee.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
      <TableCell className="text-right">
        <ManageNeighborhoodDropdown
          fee={fee as any}
          handleOpen={() => setIsMenaging((prev) => !prev)}
          isOpen={isMenaging}
        />
      </TableCell>
    </TableRow>
  );
};

export default NeighborhoodTableRow;
