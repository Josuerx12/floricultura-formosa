import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";

export function MobileHomeSearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit } = useForm();

  function handleClose() {
    setIsOpen((prev) => !prev);
  }

  const onSubmit = (data: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const search = data.search;

    if (search.length > 0) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (pathname === "/produtos" || search.length > 0) {
      router.push(`/produtos?${params.toString()}`);
      handleClose();
    }
  };

  return (
    <Suspense>
      <Sheet onOpenChange={handleClose} open={isOpen}>
        <SheetTrigger asChild>
          <IoIosSearch
            className="text-primary text-2xl cursor-pointer"
            title="Buscar produto"
          />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader className="mt-4">
            <SheetTitle className="text-sm text-white uppercase">
              Filtre pelo nome do produto!
            </SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 w-full relative flex flex-col"
          >
            <label className="flex gap-2 flex-grow bg-primary-foreground drop-shadow-md p-2 rounded-full">
              <input
                {...register("search")}
                placeholder="Buscar por nome do produto"
                className="bg-transparent text-sm text-primary flex-grow border-r  placeholder:text-primary outline-none "
                type="text"
              />
              <button type="submit" className="w-fit">
                <IoIosSearch className="text-primary text-2xl " />
              </button>
            </label>
          </form>
        </SheetContent>
      </Sheet>
    </Suspense>
  );
}
