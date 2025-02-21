"use client";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const HomeSearchFilter = () => {
  const router = useRouter();
  const pathname = usePathname(); // Obtém a rota atual
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );
  const [isFirstRender, setIsFirstRender] = useState(true); // Controle da primeira renderização

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    setInputValue(data.search);
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (inputValue.length > 0) {
      params.set("search", inputValue);
    } else {
      params.delete("search");
    }

    if (pathname === "/produtos" || inputValue.length > 0) {
      router.push(`/produtos?${params.toString()}`);
    }
  }, [inputValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="hidden md:block max-w-[300px] w-full"
    >
      <label className="flex gap-2 w-full bg-primary-foreground drop-shadow-md p-2 rounded-full">
        <Search className="text-primary" />
        <input
          {...register("search")}
          placeholder="Buscar por nome do produto"
          className="bg-transparent flex-grow placeholder:text-primary outline-none"
          type="text"
        />
      </label>
    </form>
  );
};

export default HomeSearchFilter;
