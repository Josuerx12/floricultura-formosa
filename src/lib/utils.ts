import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order } from "./actions/orders";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const abbreviatedMonths = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function parseOrderStatus(order: any): {
  message: string;
  bgColor: string;
  textColor: string;
} {
  switch (order.status) {
    case "CANCELED":
      return {
        message: "Cancelado.",
        bgColor: "bg-red-500",
        textColor: "text-white",
      };
    case "SHIPPED":
      return {
        message: "Em rota de entrega",
        bgColor: "bg-yellow-500",
        textColor: "text-black",
      };
    case "DELIVERED":
      return {
        message: "Entregue",
        bgColor: "bg-green-500",
        textColor: "text-white",
      };
    case "PENDING":
      return {
        message: "Pagamento pendente.",
        bgColor: "bg-gray-500",
        textColor: "text-white",
      };
    case "PROCESSING":
      return {
        message: "Em separação.",
        bgColor: "bg-gray-400",
        textColor: "text-black",
      };
    default:
      return {
        message: "Status desconhecido.",
        bgColor: "bg-gray-300",
        textColor: "text-black",
      };
  }
}

export function toCents(value: string | number): number {
  if (typeof value === "string") {
    // Troca vírgula por ponto para conversão
    value = value.replace(",", ".");
  }

  const parsed = parseFloat(value as string);
  if (isNaN(parsed))
    throw new Error("Valor inválido para conversão em centavos.");

  return Math.round(parsed * 100);
}
export function fromCents(value: number): number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("Valor inválido para conversão de centavos.");
  }

  return parseFloat((value / 100).toFixed(2));
}
