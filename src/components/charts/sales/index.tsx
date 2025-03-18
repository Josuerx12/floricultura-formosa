"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
type chartData = {
  month: string;
  sales: number;
}[];

const chartConfig = {
  sales: {
    label: "Vendas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SalesChart({ data }: { data: chartData }) {
  return (
    <Card className="basis-96 flex-grow">
      <CardHeader>
        <CardTitle>Gráfico de receita em vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="sales"
              type="natural"
              strokeWidth={2}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando total em receita até a ultima venda realizada. Considerar
          valores em BRL.
        </div>
      </CardFooter>
    </Card>
  );
}
