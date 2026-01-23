import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Holding } from '@/types/investment';

interface PortfolioChartProps {
  holdings: Holding[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const PortfolioChart = ({ holdings }: PortfolioChartProps) => {
  const data = holdings.reduce((acc, h) => {
    const existing = acc.find(d => d.name === h.platform);
    if (existing) {
      existing.value += h.currentValue;
    } else {
      acc.push({ name: h.platform, value: h.currentValue });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};