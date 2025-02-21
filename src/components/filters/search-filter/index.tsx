"use client";
import useDebounce from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

const SearchFilter = ({ placeholder }: { placeholder: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );
  const debouncedInputValue = useDebounce(inputValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedInputValue) {
      params.set("search", debouncedInputValue);
    } else {
      params.delete("search");
    }

    // Sempre resetar a paginação ao buscar
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  }, [debouncedInputValue]);

  return (
    <Suspense>
      <form className="max-w-[300px] w-full">
        <label className="flex gap-2 w-full bg-neutral-200 p-2 rounded-full">
          <Search />
          <input
            value={inputValue}
            onChange={handleInputChange}
            placeholder={`Buscar por nome ${placeholder}`}
            className="bg-transparent flex-grow placeholder:text-neutral-700 outline-none"
            type="text"
          />
        </label>
      </form>
    </Suspense>
  );
};

export default SearchFilter;
