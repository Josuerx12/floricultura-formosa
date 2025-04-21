import { ListAllMessageSuggestions } from "@/lib/actions/message-suggestion/infraestructure/actions/list-all";
import { MessageCircleHeart } from "lucide-react";
import React from "react";

const MessageSuggestionPage = async () => {
  const messages = await ListAllMessageSuggestions();
  return (
    <div className="flex flex-col gap-4 justify-center max-w-screen-lg mx-auto">
      <h2 className="capitalize text-center text-xl font-semibold">
        Sugestão de mensagens
      </h2>

      {messages?.map((m) => {
        return (
          <div
            key={m.id}
            className="flex flex-col justify-center px-2 gap-2 w-full"
          >
            <h4 className="text-xl text-start">{m.title}</h4>

            <div
              className="text-base leading-relaxed prose prose-p:my-2 "
              dangerouslySetInnerHTML={{ __html: m.content }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageSuggestionPage;
