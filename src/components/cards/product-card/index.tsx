"use client";

import { BadgePercent } from "lucide-react";
import { Product } from "@/lib/actions/products";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.promotions && product.promotions.length > 0
      ? Number(product.promotions[0]?.discount_percentage)
      : 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  const stockMessage =
    product.stock_quantity <= 10
      ? `Restam apenas ${product.stock_quantity} unidades!`
      : `${product.stock_quantity} unidades disponíveis`;

  return (
    <div className="relative border rounded-lg p-4 shadow-sm group hover:shadow-lg transition duration-300 ease-in-out">
      <img
        src={product.product_images?.[0]?.url || "/images/placeholder.png"}
        alt={product.name}
        className="w-full h-52 object-cover rounded-md"
      />

      {discount > 0 && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center space-x-1">
          <BadgePercent className="w-4 h-4" />
          <span>{discount}% OFF</span>
        </div>
      )}

      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>

      {finalPrice !== product.price ? (
        <p className="text-red-500 font-bold">
          R$ {finalPrice.toFixed(2)}{" "}
          <span className="text-gray-400 line-through">
            R$ {product.price.toFixed(2)}
          </span>
        </p>
      ) : (
        <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
      )}

      <form>
        <select className="w-full text-sm" defaultValue={""}>
          <option className="w-full" value={""} disabled>
            Quantidade
          </option>

          {Array.from({ length: product.stock_quantity }).map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} {i + 1 > 1 ? "Unidades" : "Unidade"}
            </option>
          ))}
        </select>
        <p
          className={`mt-2 text-sm ${
            product.stock_quantity <= 10
              ? "text-red-600 font-bold"
              : "text-gray-600"
          }`}
        >
          {stockMessage}
        </p>

        <button className="bg-primary-foreground/80 p-2 w-full rounded-sm text-white mt-2 hover:bg-primary-foreground duration-200">
          Adicionar ao carrinho
        </button>
      </form>
    </div>
  );
}
