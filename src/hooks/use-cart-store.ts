"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "./use-toast";

export type ProductCart = {
  id: number;
  name: string;
  product_image?: string;
  price: number;
  total_stock: number;
  quantity: number;
};

interface CartState {
  products: ProductCart[];
  fee_id?: string | null;
  fee?: number;
  addProduct: (product: ProductCart) => void;
  addFee: (fee: number, fee_id: string) => void;
  removeFee: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  totalPrice: () => number;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      products: [],
      fee: 0,

      addProduct: (product) => {
        set((state) => {
          const existingProduct = state.products.find(
            (p) => p.id === product.id
          );
          if (existingProduct) {
            return {
              products: state.products.map((p) => {
                if (p.id === product.id) {
                  const totalQuantity = p.quantity + product.quantity;

                  if (totalQuantity > product.total_stock) {
                    toast({
                      title: "Erro ao adicionar produto",
                      description: "Quantidade em estoque insuficiente.",
                      variant: "destructive",
                      duration: 2000,
                    });

                    return p;
                  }

                  toast({
                    title: "Quantidade atualizada",
                    description: `${product.name} agora tem ${totalQuantity} no carrinho.`,
                    duration: 2000,
                  });

                  return { ...p, quantity: totalQuantity };
                }

                return p;
              }),
            };
          }

          toast({
            title: "Produto adicionado",
            description: `${product.name} foi adicionado ao carrinho.`,
            duration: 2000,
          });

          return {
            products: [
              ...state.products,
              { ...product, quantity: product.quantity },
            ],
          };
        });
      },

      addFee: (fee: number, fee_id: string) => {
        set(() => {
          toast({
            title: "Taxa de entrega adicionada",
            description: `Uma taxa de R$ ${fee.toFixed(
              2
            )} foi aplicada ao carrinho.`,
            duration: 2000,
          });

          return { fee, fee_id };
        });
      },

      removeFee: () => {
        set(() => {
          return { fee: undefined, fee_id: undefined };
        });
      },

      increaseQuantity: (id) => {
        set((state) => {
          const product = state.products.find((p) => p.id === id);
          if (!product) return state;

          if (product.quantity + 1 > product.total_stock) {
            toast({
              title: "Estoque insuficiente",
              description: "Não há mais unidades disponíveis.",
              variant: "destructive",
              duration: 2000,
            });

            return state;
          }

          toast({
            title: "Quantidade aumentada",
            description: `Agora você tem ${product.quantity + 1}x ${
              product.name
            }.`,
            duration: 2000,
          });

          return {
            products: state.products.map((p) =>
              p.id === id ? { ...p, quantity: p.quantity + 1 } : p
            ),
          };
        });
      },

      decreaseQuantity: (id) => {
        set((state) => {
          const product = state.products.find((p) => p.id === id);
          if (!product) return state;

          if (product.quantity === 1) {
            toast({
              title: "Produto removido",
              description: `${product.name} foi removido do carrinho.`,
              duration: 2000,
            });

            return {
              products: state.products.filter((p) => p.id !== id),
            };
          }

          toast({
            title: "Quantidade reduzida",
            description: `Agora você tem ${product.quantity - 1}x ${
              product.name
            }.`,
            duration: 2000,
          });

          return {
            products: state.products.map((p) =>
              p.id === id ? { ...p, quantity: p.quantity - 1 } : p
            ),
          };
        });
      },

      clearCart: () => {
        toast({
          title: "Carrinho limpo",
          description: "Todos os produtos foram removidos do carrinho.",
          duration: 2000,
        });

        set({ products: [] });
      },

      totalPrice: () => {
        const { products, fee } = get();

        const productTotal = products.reduce((acc, p) => {
          return acc + p.price * p.quantity;
        }, 0);

        return productTotal + (fee || 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
