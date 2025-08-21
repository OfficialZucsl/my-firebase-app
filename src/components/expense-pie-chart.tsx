
'use client';

import { Pie, PieChart, Cell } from 'recharts';
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
import type { PersonalTransaction } from '@/lib/types';
import { useMemo } from 'react';

const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    '#8884d8', '#82ca9d', '#ffc658'
];

export default function ExpensePieChart({ transactions }: { transactions: PersonalTransaction[] }) {
    
    const expenseByCategory = useMemo(() => {
        return transactions.reduce((acc, t) => {
            if (t.type === 'expense') {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [transactions]);
    
    const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        chartData.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: COLORS[index % COLORS.length]
            };
        });
        return config;
    }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>By Category</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-[250px]">
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
            </ChartContainer>
        ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No expense data to display.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
