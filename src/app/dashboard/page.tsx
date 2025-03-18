"use client";

import StatistcCard from "@/components/cards/statistc-card";
import LastSalesChart from "@/components/charts/last-sales";
import { SalesChart } from "@/components/charts/sales";
import Loading from "@/components/loading";
import { getStatistcs } from "@/lib/analytics";
import { abbreviatedMonths } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, DollarSign, Users } from "lucide-react";
import React, { Suspense } from "react";

const MetricasPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistcs,
  });

  console.log(data);

  return (
    <div className="max-w-screen-2xl mx-auto p-4">
      <h2 className="text-center mb-6 text-2xl font-medium">Métricas Gerais</h2>
      {isPending && <Loading />}
      {!isPending && data && (
        <>
          <div className="flex gap-4 flex-wrap justify-between">
            {data.totalSalesAmount && (
              <StatistcCard
                Icon={DollarSign}
                isCurrency={true}
                title="Receita total"
                value={data.totalSalesAmount}
              />
            )}
            {data.totalFreightAmount && (
              <StatistcCard
                Icon={DollarSign}
                isCurrency={true}
                title="Receita total em frete"
                value={data.totalFreightAmount}
              />
            )}
            {data.totalSales && (
              <StatistcCard
                Icon={CreditCard}
                isCurrency={false}
                title="Total em vendas"
                value={data.totalSales}
              />
            )}

            {data.usersCount && (
              <StatistcCard
                Icon={Users}
                isCurrency={false}
                title="Usuários"
                value={data.usersCount}
              />
            )}
          </div>

          <div className="mt-10 flex gap-4 flex-wrap">
            <SalesChart
              data={data.salesByMonth.map((s) => {
                const monthIndex = parseInt(s.month.split("-")[1]);

                return {
                  month: abbreviatedMonths[monthIndex - 1],
                  sales: s.totalSalesAmount,
                };
              })}
            />

            <LastSalesChart sales={data.lastSales} />
          </div>
        </>
      )}
    </div>
  );
};

export default MetricasPage;
