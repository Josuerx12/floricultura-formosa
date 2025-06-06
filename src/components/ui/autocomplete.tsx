import React, { useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface AutocompleteProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder,
  name,
  required,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    setInputValue(
      value ? options.find((o) => o.value === value)?.label || "" : ""
    );
  }, [value, options]);

  const filtered = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Input
            name={name}
            required={required}
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
            className="cursor-pointer"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[200px] max-h-60 overflow-auto">
        {filtered.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground">
            Nenhum bairro encontrado
          </div>
        ) : (
          filtered.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer hover:bg-primary/10 text-sm ${
                option.value === value ? "bg-primary/10" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setInputValue(option.label);
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};
