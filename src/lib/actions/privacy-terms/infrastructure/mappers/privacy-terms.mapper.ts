import { Prisma } from "@prisma/client";
import { PrivacyTerms } from "../../domain/privacy-terms.entity";

export type PrivacyTermsPlainObject = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PrivacyTermsMapper {
  static toModel(entity: PrivacyTerms): Prisma.privacity_termsCreateInput {
    return {
      id: entity.id,
      content: entity.content,
    };
  }

  static toEntity(model: Prisma.privacity_termsGetPayload<{}>): PrivacyTerms {
    return new PrivacyTerms({
      id: model.id,
      content: model.content,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });
  }

  static toPlainObject(
    model: Prisma.privacity_termsGetPayload<{}>
  ): PrivacyTermsPlainObject {
    return {
      id: model.id,
      content: model.content,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
