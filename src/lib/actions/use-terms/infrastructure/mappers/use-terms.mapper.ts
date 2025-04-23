import { Prisma } from "@prisma/client";
import { UseTerms } from "../../domain/use-terms.entity";

export type UseTermsPlainObject = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UseTermsMapper {
  static toModel(entity: UseTerms): Prisma.use_termsCreateInput {
    return {
      id: entity.id,
      content: entity.content,
    };
  }

  static toEntity(model: Prisma.use_termsGetPayload<{}>): UseTerms {
    return new UseTerms({
      id: model.id,
      content: model.content,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });
  }

  static toPlainObject(
    model: Prisma.use_termsGetPayload<{}>
  ): UseTermsPlainObject {
    return {
      id: model.id,
      content: model.content,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
