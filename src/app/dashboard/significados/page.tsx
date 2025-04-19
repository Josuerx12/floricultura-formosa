"use client";

import EntityPage from "@/components/page/entity-page";
import { TableCell, TableRow } from "@/components/ui/table";
import { GetAllFlowerMeanings } from "@/lib/actions/flower-meaning/infraestructure/actions/get-all";
import React from "react";

const FlowerMeaningDashboardPage = () => {
  return (
    <EntityPage
      title="Mensagens"
      queryFn={GetAllFlowerMeanings}
      columns={["Título", "Conteúdo", "Criado em"]}
      renderRow={(msg) => (
        <TableRow key={msg.id}>
          <TableCell>{msg.name}</TableCell>
          <TableCell>{msg.description}</TableCell>
          <TableCell>
            {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
          </TableCell>
        </TableRow>
      )}
    />
  );
};

export default FlowerMeaningDashboardPage;
