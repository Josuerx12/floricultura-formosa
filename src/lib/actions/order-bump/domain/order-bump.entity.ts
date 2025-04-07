import { Product } from "../../products";

export class OrderBump {
  id?: number;
  productId: number;
  bumpProductId: number;
  bumpPrice: number;
  bumpProduct?: Product;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: any) {
    this.id = props.id;
    this.productId = props.productId;
    this.bumpProductId = props.bumpProductId;
    this.bumpPrice = props.bumpPrice;
    this.bumpProduct = props.bumpProduct;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    this.validate();
  }

  validate() {}
}
