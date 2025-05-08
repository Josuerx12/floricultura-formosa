import { Product } from "../../products";

export class OrderBump {
  id?: number;
  categoryId: number;
  bumpProductId: number;
  bumpProduct?: Product;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: any) {
    this.id = props.id;
    this.categoryId = props.categoryId;
    this.bumpProductId = props.bumpProductId;
    this.bumpProduct = props.bumpProduct;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    this.validate();
  }

  validate() {}
}
