"use client";

import EntityPage from "@/components/page/entity-page";
import { TableCell, TableRow } from "@/components/ui/table";
import { GetAllFlowerCares } from "@/lib/actions/flower-care/infraestructure/actions/get-all";
import React from "react";

const ComoCuidarDashboardPage = () => {
  return (
    <EntityPage
      title="Metodos de como cuidar"
      queryFn={GetAllFlowerCares}
      columns={["Título", "Conteúdo", "Criado em"]}
      renderRow={(msg) => (
        <TableRow key={msg.id}>
          <TableCell>{msg.title}</TableCell>
          <TableCell>{msg.content}</TableCell>
          <TableCell>
            {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
          </TableCell>
        </TableRow>
      )}
    />
  );
};

export default ComoCuidarDashboardPage;
