import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface FinancialDistributionChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
}

const FinancialDistributionChart: React.FC<FinancialDistributionChartProps> = ({
  data,
  colors = ["#CB3CFF", "#7F25FB", "#AEB9E1", "#D1DBF9", "#7E89AC"],
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0B1739",
            border: "1px solid #343B4F",
            borderRadius: "8px",
            color: "#FFFFFF",
          }}
          itemStyle={{ color: "#FFFFFF" }}
          labelStyle={{ color: "#AEB9E1", fontWeight: "bold" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FinancialDistributionChart;
