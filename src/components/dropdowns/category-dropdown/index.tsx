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
    <div className="relative w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="z-50 select-none outline-none uppercase flex items-center justify-between w-full gap-2 cursor-pointer">
          Categorias <ChevronDown />
        </DropdownMenuTrigger>

        {isOpen && (
          <DropdownMenuContent
            onMouseLeave={() => setIsOpen(false)}
            className="w-80 absolute top-full right-1/2 translate-x-1/2  bg-primary text-primary-foreground shadow-lg rounded-md"
          >
            <DropdownMenuLabel>Categorias</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {categories.map((category) => (
                <div key={category.id} className="py-1">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        "/produtos/" + category.name?.replaceAll(" ", "-")
                      )
                    }
                    className="font-semibold cursor-pointer hover:bg-primary-foreground hover:text-primary"
                  >
                    {category.name}
                  </DropdownMenuItem>
                  {category.subcategories?.map((sub) => (
                    <DropdownMenuItem
                      key={sub.id}
                      onClick={() => handleNavigate(category.name, sub.name)}
                      className="pl-6 hover:bg-primary-foreground hover:text-primary cursor-pointer"
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
