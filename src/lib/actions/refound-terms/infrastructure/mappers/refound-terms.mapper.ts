import { Prisma } from "@prisma/client";
import { RefoundTerms } from "../../domain/refound-terms.entity";

export type RefoundTermsPlainObject = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export class RefoundTermsMapper {
  static toModel(entity: RefoundTerms): Prisma.refound_termsCreateInput {
    return {
      id: entity.id,
      content: entity.content,
    };
  }

  static toEntity(model: Prisma.refound_termsGetPayload<{}>): RefoundTerms {
    return new RefoundTerms({
      id: model.id,
      content: model.content,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });
  }

  static toPlainObject(
    model: Prisma.refound_termsGetPayload<{}>
  ): RefoundTermsPlainObject {
    return {
      id: model.id,
      content: model.content,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
