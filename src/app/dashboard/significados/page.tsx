"use client";

import { CreateFlowerMeaningModal } from "@/components/modals/flower-meaning/create";
import EntityPage from "@/components/page/entity-page";
import { TableCell, TableRow } from "@/components/ui/table";
import { GetAllFlowerMeanings } from "@/lib/actions/flower-meaning/infraestructure/actions/get-all";
import React from "react";

const FlowerMeaningDashboardPage = () => {
  return (
    <EntityPage
      title="Significado de Flores"
      ModalComponent={<CreateFlowerMeaningModal />}
      queryFn={GetAllFlowerMeanings}
      columns={["Título", "Criado em", ""]}
      renderRow={(msg) => (
        <TableRow key={msg.id}>
          <TableCell>{msg.name}</TableCell>
          <TableCell>
            {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
    />
  );
};

export default FlowerMeaningDashboardPage;
