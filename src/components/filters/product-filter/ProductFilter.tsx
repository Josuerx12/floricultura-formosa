"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const currentOrder = searchParams.get("order_by") as "asc" | "desc" | null;
  const [selectedOrder, setSelectedOrder] = useState<"asc" | "desc">(
    currentOrder || "asc"
  );

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order_by", selectedOrder);
    router.replace(`?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-semibold">
          Filtrar produtos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Ordenar produtos</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ordenar por preço
            </label>
            <Select
              value={selectedOrder}
              onValueChange={(value: "asc" | "desc") => setSelectedOrder(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a ordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Mais baratos primeiro</SelectItem>
                <SelectItem value="desc">Mais caros primeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={applyFilter} className="w-full sm:w-auto">
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFilter;
