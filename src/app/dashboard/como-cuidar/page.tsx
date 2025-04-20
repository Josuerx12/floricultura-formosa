"use client";

import { CreateFlowerCareModal } from "@/components/modals/flower-care/create";
import EntityPage from "@/components/page/entity-page";
import { TableCell, TableRow } from "@/components/ui/table";
import { GetAllFlowerCares } from "@/lib/actions/flower-care/infraestructure/actions/get-all";
import React from "react";

const ComoCuidarDashboardPage = () => {
  return (
    <EntityPage
      title="Metodos de como cuidar"
      queryFn={GetAllFlowerCares}
      ModalComponent={<CreateFlowerCareModal />}
      columns={["Título", "Criado em", ""]}
      renderRow={(msg) => (
        <TableRow key={msg.id}>
          <TableCell>{msg.title}</TableCell>
          <TableCell>
            {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
    />
  );
};

export default ComoCuidarDashboardPage;
