import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category } from "@/lib/actions/category";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CategoryAccordeon = ({
  categories,
  handleClose,
}: {
  categories: Category[];
  handleClose: VoidFunction;
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | undefined>(undefined);

  const handleNavigate = (categorySlug: string, subCategorySlug: string) => {
    router.push(`/produtos/${categorySlug}/${subCategorySlug}`);
    setExpanded(undefined);
    handleClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push("/produtos/" + categoryName);
    setExpanded(undefined);
    handleClose();
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={expanded}
      onValueChange={(val) => setExpanded(val === expanded ? undefined : val)} // Alterna entre abrir/fechar
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Categorias</AccordionTrigger>
        <AccordionContent>
          {categories.map((category) => (
            <div key={category.id} className="py-1">
              <div
                onClick={() => handleCategoryClick(category.slug)}
                className="cursor-pointer p-2 rounded-md text-primary hover:opacity-80 font-bold  text-lg my-2"
              >
                {category.name}
              </div>
              {category.subcategories?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleNavigate(category.slug, sub.slug)}
                  className="pl-6 py-2 cursor-pointer rounded-md text-primary hover:opacity-80 font-semibold  my-2"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryAccordeon;
