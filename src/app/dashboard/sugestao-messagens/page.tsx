"use client";
import { GetAllMessageSuggestions } from "@/lib/actions/message-suggestion/infraestructure/actions/get-all";

import { TableCell, TableRow } from "@/components/ui/table";
import EntityPage from "@/components/page/entity-page";
import { CreateMessageSuggestionModal } from "@/components/modals/message-suggestion/create";

const MessageSuggestionPage = () => (
  <EntityPage
    title="Mensagens"
    ModalComponent={<CreateMessageSuggestionModal />}
    queryFn={GetAllMessageSuggestions}
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

export default MessageSuggestionPage;
