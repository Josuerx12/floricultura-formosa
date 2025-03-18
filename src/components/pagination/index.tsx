"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const router = useRouter();

  const createPageLink = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    <Suspense>
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button
          onClick={() => router.push(createPageLink(currentPage - 1))}
          disabled={currentPage <= 1}
          variant="outline"
        >
          Anterior
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => router.push(createPageLink(page))}
            variant={currentPage === page ? "default" : "outline"}
            className={cn(
              currentPage === page && "bg-prim text-primary-foreground"
            )}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => router.push(createPageLink(currentPage + 1))}
          disabled={currentPage >= totalPages}
          variant="outline"
        >
          Próximo
        </Button>
      </div>
    </Suspense>
  );
};

export default Pagination;
