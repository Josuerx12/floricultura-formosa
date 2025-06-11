"use client";

import { useEffect, useState } from "react";
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

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  const currentOrder = searchParams.get("order_by");

  const handleOrderChange = (value: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order_by", value);
    router.replace(`?${params.toString()}`);
    handleOpen();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button>Filtrar produtos</Button>
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
              defaultValue={currentOrder ?? "asc"}
              onValueChange={(value: "asc" | "desc") =>
                handleOrderChange(value)
              }
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFilter;
