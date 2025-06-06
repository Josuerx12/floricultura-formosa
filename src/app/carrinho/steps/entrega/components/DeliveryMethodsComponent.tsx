"use client";
import { useCheckout } from "@/hooks/use-checkout";
import { Truck, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useCartStore, { ProductCart } from "@/hooks/use-cart-store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

const DeliveryMethodsComponent = () => {
  const { firstStep } = useCheckout();
  const { products } = useCartStore();
  const [selected, setSelected] = useState<"entrega" | "retirada" | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (products && products.length <= 0) {
      router.push("/");
    }
  }, [products, router]);

  const options = [
    {
      id: "entrega",
      icon: <Truck className="w-8 h-8 text-primary-hard_pink drop-shadow" />,
      title: "Entrega",
      subtitle: "Receba suas flores em casa",
      action: () => {
        firstStep(true);
        router.push("/carrinho/steps/endereco");
      },
    },
    {
      id: "retirada",
      icon: <Store className="w-8 h-8 text-primary-hard_pink drop-shadow" />,
      title: "Retirada",
      subtitle: "Retire pessoalmente na loja",
      action: () => {
        firstStep(false);
        router.push("/carrinho/steps/destinatario");
      },
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
      {options.map((option) => (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={`transition-all duration-300 rounded-2xl border-2 p-6 flex flex-col items-center gap-3 shadow-md bg-white/60 backdrop-blur-md
            ${
              selected === option.id
                ? "border-primary-hard_pink shadow-lg scale-105"
                : "border-transparent hover:border-primary-hard_pink"
            }`}
          onClick={() => {
            setSelected(option.id);
            setTimeout(option.action, 250);
          }}
        >
          {option.icon}
          <span className="text-base font-semibold text-title">
            {option.title}
          </span>
          <span className="text-xs text-price">{option.subtitle}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default DeliveryMethodsComponent;
