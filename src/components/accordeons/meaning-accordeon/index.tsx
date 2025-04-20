import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Flower2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FlowerMeaningsAccordeon = ({
  meanings,
  handleClose,
}: {
  meanings: { name: string; id: string }[];
  handleClose: VoidFunction;
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | undefined>(undefined);

  const handleNavigate = (id: string) => {
    router.push(`/significados/${id}`);
    setExpanded(undefined);
    handleClose();
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={expanded}
      onValueChange={(val) => setExpanded(val === expanded ? undefined : val)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Significado das Flores</AccordionTrigger>
        <AccordionContent>
          {meanings.map((meaning) => (
            <div key={meaning.id} className="py-1">
              <div
                onClick={() => handleNavigate(meaning.id)}
                className="cursor-pointer p-2 flex items-center gap-1 rounded-md text-primary hover:opacity-70 font-semibold  my-2"
              >
                <Flower2 /> {meaning.name}
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FlowerMeaningsAccordeon;
