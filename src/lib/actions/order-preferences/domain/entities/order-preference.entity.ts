import { PhoneNumber } from "../vo/phone-number.vo";

export class OrderPreference {
  id?: string;
  orderId: string;
  phone: string;
  from?: string;
  to?: string;
  message?: string;
  deliveryDate: Date;

  constructor(props: any) {
    this.id = props.id;
    this.orderId = props.order_id;
    this.phone = new PhoneNumber(props.phone).getValue();
    this.from = props.from;
    this.to = props.to;
    this.message = props.message;
    this.deliveryDate = new Date(props.delivery_date);

    this.validate();
  }

  private validate() {
    if (this.from && !this.to) {
      throw new Error("Deve especificar de quem para quem.");
    }

    if (this.to && !this.from) {
      throw new Error("Deve especificar de quem para quem.");
    }

    if (this.message && this.message.length < 3) {
      throw new Error("O campo 'Mensagem' deve ter pelo menos 3 caracteres.");
    }

    if (this.deliveryDate) {
      throw new Error("O campo 'data de entrega' deve ter preenchido.");
    }
  }
}
