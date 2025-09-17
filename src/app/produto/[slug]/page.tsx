import ProductDetails from "./product-details";
import BackBtn from "@/components/buttons/back-btn";
import { getProductById, getProductBySlug } from "@/lib/actions/products";

const ProductPage = async ({ params }: { params: any }) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="text-center text-red-500">Produto não encontrado</div>
    );
  }

  return (
    <div className="flex flex-col py-10 px-2 min-h-screen w-full">
      <div className="w-full pb-6 flex justify-start max-w-screen-xl mx-auto">
        <BackBtn />
      </div>

      <div className="w-full max-w-screen-xl mx-auto">
        <ProductDetails product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
