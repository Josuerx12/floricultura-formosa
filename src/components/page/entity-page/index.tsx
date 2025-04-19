import SearchFilter from "@/components/filters/search-filter";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const EntityPage = ({
  title,
  queryFn,
  columns,
  renderRow,
  ModalComponent,
  dropdownKey,
}: {
  title: string;
  queryFn: (args: { search: string; page: number }) => Promise<any>;
  columns: string[];
  renderRow: (item: any) => React.ReactNode;
  ModalComponent?: React.ReactNode;
  dropdownKey?: string;
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: [title.toLowerCase(), search, page],
    queryFn: () => queryFn({ page, search }),
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder={title.toLowerCase()} />
      </div>

      {isPending ? (
        <Loading />
      ) : (
        <>
          <Table>
            {data?.items?.length <= 0 && (
              <TableCaption>
                <p className="text-center text-muted-foreground mt-4">
                  Nenhum dado encontrado para esta seção.
                </p>
              </TableCaption>
            )}
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{data?.items?.map(renderRow)}</TableBody>
          </Table>
          {data?.totalPages > 1 && <Pagination totalPages={data.totalPages} />}
        </>
      )}
    </div>
  );
};

export default EntityPage;
