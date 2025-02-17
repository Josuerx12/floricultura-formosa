"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/lib/actions/category";

const CategoryDropdown = ({ categories }: { categories: Category[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (category: string, subcategory: string) => {
    router.push(
      `/produtos/${category?.replaceAll(" ", "-")}/${subcategory?.replaceAll(
        " ",
        "-"
      )}`
    );
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className="text-white md:text-primary-foreground z-50 select-none outline-none uppercase flex items-center gap-2 cursor-pointer"
          onMouseEnter={() => setIsOpen(true)}
        >
          Categorias <ChevronDown />
        </DropdownMenuTrigger>

        {isOpen && (
          <DropdownMenuContent
            onMouseLeave={() => setIsOpen(false)}
            className="w-56 absolute top-full left-0 bg-white shadow-lg rounded-md"
          >
            <DropdownMenuLabel>Categorias</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {categories.map((category) => (
                <div key={category.id} className="py-1">
                  <DropdownMenuItem className="font-semibold cursor-default">
                    {category.name}
                  </DropdownMenuItem>
                  {category.subcategories?.map((sub) => (
                    <DropdownMenuItem
                      key={sub.id}
                      onClick={() => handleNavigate(category.name, sub.name)}
                      className="pl-6"
                    >
                      {sub.name}
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};

export default CategoryDropdown;
