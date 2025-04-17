import { create } from "zustand";

type Address = {
  delivery_fee: {
    fee: number;
  };
  number: string;
  state: string;
  id: string;
  street: string;
  complement: string | null;
  district: string;
  city: string;
  zipCode: string;
};

type Checkout = {
  step: number;
  delivery: boolean;
  address?: Address;
  deliveryDate?: Date;
  phone?: string;
  message?: string;
  to?: string;
  from?: string;

  firstStep: (delivery: boolean) => void;
  secondStep: (address: Address) => void;
  thirdStep: (phone: string, message: string, to: string, from: string) => void;
  getCheckoutSummary: () => object;
  resetCheckout: () => void;
};

export const useCheckout = create<Checkout>((set, get) => ({
  step: 1,
  delivery: false,

  firstStep: (delivery) =>
    set(() => ({
      delivery,
      step: delivery ? 2 : 3, // Pula o endereço se não for entrega
    })),

  secondStep: (address) =>
    set(() => ({
      address,
      step: 3,
    })),

  thirdStep: (phone, message, to, from) =>
    set(() => ({
      phone,
      message,
      to,
      from,
      step: 4,
    })),

  getCheckoutSummary: () => {
    const { delivery, address, phone, message, to, from } = get();
    return {
      delivery,
      ...(delivery ? { address } : {}),
      recipient: {
        phone,
        message,
        to,
        from,
      },
    };
  },

  resetCheckout: () =>
    set(() => ({
      step: 1,
      delivery: false,
      address: undefined,
      deliveryDate: undefined,
      phone: undefined,
      message: undefined,
      to: undefined,
      from: undefined,
    })),
}));
