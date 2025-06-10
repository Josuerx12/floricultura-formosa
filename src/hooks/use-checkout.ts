import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  delivery?: boolean;
  address?: Address;
  deliveryDate?: Date;
  phone?: string;
  message?: string;
  to?: string;
  from?: string;

  firstStep: (delivery: boolean) => void;
  secondStep: (address: Address, deliveryDate: Date) => void;
  thirdStep: (phone: string, message: string, to: string, from: string) => void;
  getCheckoutSummary: () => {
    delivery: boolean;
    address?: Address | null;
    deliveryDate?: Date;
    recipient: {
      phone?: string;
      message?: string;
      to?: string;
      from?: string;
    };
  };
  resetCheckout: () => void;
  goToStep: (step: number) => void;
  previousStep: () => void;
};

export const useCheckout = create<Checkout>()(
  persist(
    (set, get) => ({
      step: 1,
      delivery: undefined,

      goToStep: (step) => set(() => ({ step })),

      previousStep: () => {
        const { step, delivery } = get();

        if (step === 3 && delivery === false) {
          set(() => ({ step: 1 }));
        } else {
          set(() => ({ step: Math.max(1, step - 1) }));
        }
      },

      firstStep: (delivery) =>
        set(() => ({
          delivery: delivery,
          step: delivery ? 2 : 3,
        })),

      secondStep: (address, deliveryDate) =>
        set(() => ({
          address,
          deliveryDate,
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
        const { delivery, address, deliveryDate, phone, message, to, from } =
          get();
        return {
          delivery:
            typeof delivery == "undefined" ||
            (typeof delivery == "boolean" && !delivery)
              ? false
              : true,
          address: delivery ? address : null,
          deliveryDate,
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
          delivery: undefined,
          address: undefined,
          deliveryDate: undefined,
          phone: undefined,
          message: undefined,
          to: undefined,
          from: undefined,
        })),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
