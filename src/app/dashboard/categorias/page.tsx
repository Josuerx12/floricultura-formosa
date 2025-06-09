import { prisma } from "@/lib/db/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateCategoriaModal from "@/components/modals/category/create";
import SearchFilter from "@/components/filters/search-filter";
import ManageCategoryDropdown from "@/components/dropdowns/MenageCategoryDropdown";
import Pagination from "@/components/pagination";
import CategoriesTableRow from "./components/CategoriesTableRow";

const CategoriasPage = async ({ searchParams }: { searchParams: any }) => {
  const { search, page } = await searchParams;

  const perPage = 10;
  const currentPage = page ?? 1;

  const totalCategories = await prisma.category.count({
    where: {
      OR: [
        {
          name: {
            contains: search ?? "",
          },
        },
        !isNaN(Number(search))
          ? {
              id: Number(search),
            }
          : {},
      ],
    },
  });

  const totalPages = Math.ceil(totalCategories / perPage);

  const categorias = await prisma.category.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search ?? "",
            mode: "insensitive",
          },
        },
        !isNaN(Number(search))
          ? {
              id: Number(search),
            }
          : {},
      ],
    },
    take: perPage ?? 10,
    skip: (currentPage - 1) * perPage,
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="categorias" />
        <CreateCategoriaModal />
      </div>
      <Table>
        {categorias?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar categorias cadastradas.
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Data criação</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <CategoriesTableRow category={categoria} key={categoria.id} />
          ))}
        </TableBody>
      </Table>

      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default CategoriasPage;
