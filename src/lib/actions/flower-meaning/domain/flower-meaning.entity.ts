export class FlowerMeaning {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: any) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    this.validate();
  }

  validate() {
    if (!this.name || !this.name.trim())
      throw new Error("Nome da flor é obrigatório");
    if (!this.description || !this.description.trim())
      throw new Error("Descrição é obrigatória");
    if (!this.imageUrl || !this.imageUrl.trim())
      throw new Error("Imagem é obrigatória");
  }
}
