"use client";
import useDebounce from "@/hooks/use-debounce";
import { Loader2, Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";

const HomeSearchFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );
  const [isFirstRender, setIsFirstRender] = useState(true);

  const debouncedInputValue = useDebounce(inputValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (debouncedInputValue.length > 0) {
      params.set("search", debouncedInputValue);
    } else {
      params.delete("search");
    }

    if (pathname === "/produtos" || debouncedInputValue.length > 0) {
      router.push(`/produtos?${params.toString()}`);
    }
  }, [debouncedInputValue]);

  return (
    <Suspense>
      <form className="hidden md:block max-w-[300px] w-full">
        <label className="flex gap-2 w-full bg-primary-foreground drop-shadow-md p-2 rounded-full">
          <Search className="text-primary" />
          <input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Buscar por nome do produto"
            className="bg-transparent flex-grow text-primary placeholder:text-primary outline-none"
            type="text"
          />
        </label>
      </form>
    </Suspense>
  );
};

export default HomeSearchFilter;
