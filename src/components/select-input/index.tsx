"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type ComboboxProps = {
  inputName: string;
  label: string;
  data: Option[];
  setValue: UseFormSetValue<any>;
  value: any;
};

export function SelectInput({
  inputName,
  label,
  data,
  setValue,
  value,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = data.find((opt) => opt.value === value);

  const filteredData = query
    ? data.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : data;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={inputRef}>
      <label className="block mb-1 text-sm font-medium text-neutral-700">
        {label}
      </label>

      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-xl border bg-neutral-100 hover:bg-neutral-200 transition cursor-text text-neutral-700",
          isOpen && "ring-2 ring-blue-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          placeholder={`Selecione um(a) ${label}`}
          value={query || selectedOption?.label || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="bg-transparent outline-none w-full"
        />
        <ChevronsUpDown className="ml-2 w-4 h-4 text-neutral-500" />
      </div>

      {isOpen && filteredData.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-52 overflow-auto bg-white border border-neutral-200 rounded-xl shadow-lg">
          {filteredData.map((item) => (
            <li
              key={item.value}
              className="px-3 py-2 cursor-pointer hover:bg-neutral-100 flex items-center justify-between"
              onClick={() => {
                setValue("delivery_fee_id", item.value);
                setQuery(item.label);
                setIsOpen(false);
              }}
            >
              {item.label}
              {item.value === value && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredData.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-md p-3 text-neutral-500 text-sm">
          Nenhum {label} encontrado.
        </div>
      )}
    </div>
  );
}
