'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { month: 'March', principal: 186, interest: 80 },
  { month: 'April', principal: 305, interest: 200 },
  { month: 'May', principal: 237, interest: 120 },
  { month: 'June', principal: 73, interest: 190 },
  { month: 'July', principal: 209, interest: 130 },
  { month: 'August', principal: 214, interest: 140 },
];

const chartConfig = {
  principal: {
    label: 'Principal',
    color: 'hsl(var(--chart-1))',
  },
  interest: {
    label: 'Interest',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function RepaymentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repayment Analytics</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="principal" fill="var(--color-principal)" radius={4} />
            <Bar dataKey="interest" fill="var(--color-interest)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
