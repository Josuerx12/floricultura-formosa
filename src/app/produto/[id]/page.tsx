import { prisma } from "@/lib/db/prisma";
import ProductDetails from "./product-details";

const ProductPage = async ({ params }: { params: any }) => {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      product_images: true,
      promotions: {
        where: {
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        orderBy: { start_date: "asc" },
        take: 1,
        select: {
          discount_percentage: true,
          end_date: true,
          start_date: true,
        },
      },
    },
  });

  if (!product) {
    return (
      <div className="text-center text-red-500">Produto não encontrado</div>
    );
  }

  const discount =
    product.promotions.length > 0
      ? Number(product.promotions[0]?.discount_percentage)
      : 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  return (
    <ProductDetails
      product={product}
      finalPrice={finalPrice}
      discount={discount}
    />
  );
};

export default ProductPage;
