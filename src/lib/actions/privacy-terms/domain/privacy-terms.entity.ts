import { randomUUID } from "crypto";

type Props = {
  id?: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
};
export class PrivacyTerms {
  id: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Props) {
    this.id = props.id || randomUUID();
    this.content = props.content;
    this.createdAt = props.created_at;
    this.updatedAt = props.updated_at;
  }
}
