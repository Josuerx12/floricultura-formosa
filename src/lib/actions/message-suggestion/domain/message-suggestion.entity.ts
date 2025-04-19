export class MessageSuggestion {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: any) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    this.validate();
  }

  validate() {
    if (!this.title || !this.title.trim())
      throw new Error("Título é obrigatório");
    if (!this.content || !this.content.trim())
      throw new Error("Conteúdo é obrigatório");
  }
}
