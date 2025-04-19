"use client";
import { GetAllMessageSuggestions } from "@/lib/actions/message-suggestion/infraestructure/actions/get-all";

import { TableCell, TableRow } from "@/components/ui/table";
import EntityPage from "@/components/page/entity-page";

const MessageSuggestionPage = () => (
  <EntityPage
    title="Mensagens"
    queryFn={GetAllMessageSuggestions}
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

export default MessageSuggestionPage;
