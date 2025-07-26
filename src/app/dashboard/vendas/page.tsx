import DeliveredSalesInfiniteScroll from "@/components/infinite-scrolls/delivered-sales";
import ProcessedSalesInfiniteScroll from "@/components/infinite-scrolls/processed-sales";
import ShippedSalesInfiniteScroll from "@/components/infinite-scrolls/shipped-sales";

const SalesPage = () => {
  return (
    <div className="w-full gap-4 h-[90dvh] !overflow-x-visible flex justify-between p-2 md:p-5">
      <ProcessedSalesInfiniteScroll />
      <ShippedSalesInfiniteScroll />
      <DeliveredSalesInfiniteScroll />
    </div>
  );
};

export default SalesPage;
