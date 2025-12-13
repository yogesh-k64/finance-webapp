import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TopUsersChartProps {
  data: Array<{ name: string; value: number }>;
}

const TopUsersChart: React.FC<TopUsersChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#343B4F" />
        <XAxis type="number" stroke="#AEB9E1" />
        <YAxis dataKey="name" type="category" stroke="#AEB9E1" width={100} />
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
        <Bar dataKey="value" fill="#CB3CFF" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopUsersChart;
