import { prisma } from "@/lib/db/prisma";
import ProductDetails from "./product-details";
import BackBtn from "@/components/buttons/back-btn";
import PromoSlider from "@/components/slider/promo-slider";
import Title from "@/components/title";

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

  const relatedProducts = await prisma.product.findMany({
    where: {
      subcategory_id: product.subcategory_id,
    },
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

  return (
    <div className="flex flex-col py-10 px-2 min-h-screen w-full">
      <div className="w-full pb-6 flex justify-start max-w-screen-xl mx-auto">
        <BackBtn />
      </div>

      <div className="w-full max-w-screen-xl mx-auto">
        <ProductDetails
          product={product}
          finalPrice={finalPrice}
          discount={discount}
        />
      </div>

      <div className="w-full max-w-screen-xl mx-auto">
        <Title>Produtos Relacionados</Title>
      </div>

      <section className="w-full max-w-screen-xl mx-auto overflow-x-hidden">
        <PromoSlider products={relatedProducts} />
      </section>
    </div>
  );
};

export default ProductPage;
