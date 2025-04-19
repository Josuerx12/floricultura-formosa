import { Prisma } from "@prisma/client";
import { MessageSuggestion } from "../../domain/message-suggestion.entity";

export type MessageSuggestionPlainObject = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export class MessageSuggestionMapper {
  static toModel(
    entity: MessageSuggestion
  ): Prisma.message_suggestionCreateInput {
    return {
      title: entity.title,
      content: entity.content,
    };
  }

  static toEntity(
    model: Prisma.message_suggestionGetPayload<{}>
  ): MessageSuggestion {
    return new MessageSuggestion({
      id: model.id,
      title: model.title,
      content: model.content,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  static toPlainObject(
    model: Prisma.message_suggestionGetPayload<{}>
  ): MessageSuggestionPlainObject {
    return {
      id: model.id,
      title: model.title,
      content: model.content,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
