import ManageUserDropdown from "@/components/dropdowns/manage-user-dropdown";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

const UsersTableRow = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.createdAt.toLocaleString("pt-BR")}</TableCell>
      <TableCell className="text-right">
        <ManageUserDropdown
          user={user}
          handleOpen={() => setIsOpen((prev) => !prev)}
          isOpen={isOpen}
        />
      </TableCell>
    </TableRow>
  );
};

export default UsersTableRow;
