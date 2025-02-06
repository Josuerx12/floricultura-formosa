"use client";
import useDebounce from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

const CategoryFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") ? searchParams.get("search") : ""
  );
  const debouncedInputValue = useDebounce(inputValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    router.push(`?search=${debouncedInputValue}`);
  }, [debouncedInputValue]);

  return (
    <form className="max-w-[300px] w-full">
      <label className="flex gap-2 w-full bg-neutral-200 p-2 rounded-full">
        <Search />
        <input
          value={inputValue ?? ""}
          onChange={handleInputChange}
          placeholder="Buscar por nome da categoria"
          className="bg-transparent flex-grow placeholder:text-neutral-700 outline-none"
          type="text"
        />
      </label>
    </form>
  );
};

export default CategoryFilter;
