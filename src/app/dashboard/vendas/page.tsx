import CanceledSalesInfiniteScroll from "@/components/infinite-scrolls/canceled-sales";
import DeliveredSalesInfiniteScroll from "@/components/infinite-scrolls/delivered-sales";
import PendingSalesInfiniteScroll from "@/components/infinite-scrolls/pending-sales";
import ProcessedSalesInfiniteScroll from "@/components/infinite-scrolls/processed-sales";
import ShippedSalesInfiniteScroll from "@/components/infinite-scrolls/shipped-sales";

const SalesPage = () => {
  return (
    <div className="w-max h-[90dvh] !overflow-x-visible flex">
      <ProcessedSalesInfiniteScroll />
      <ShippedSalesInfiniteScroll />
      <DeliveredSalesInfiniteScroll />
      <PendingSalesInfiniteScroll />
      <CanceledSalesInfiniteScroll />
    </div>
  );
};

export default SalesPage;
