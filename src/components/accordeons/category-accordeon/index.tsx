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

  const handleNavigate = (category: string, subcategory: string) => {
    router.push(
      `/produtos/${category.replaceAll(" ", "-")}/${subcategory.replaceAll(
        " ",
        "-"
      )}`
    );
    setExpanded(undefined);
    handleClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push("/produtos/" + categoryName.replaceAll(" ", "-"));
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
                onClick={() => handleCategoryClick(category.name)}
                className="cursor-pointer text-primary font-bold  text-lg my-2"
              >
                {category.name}
              </div>
              {category.subcategories?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleNavigate(category.name, sub.name)}
                  className="pl-6 cursor-pointer text-primary/80 font-semibold  my-2"
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
