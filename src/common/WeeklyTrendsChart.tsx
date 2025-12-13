import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface WeeklyTrendsChartProps {
  data: Array<{ name: string; handouts: number; collections: number }>;
}

const WeeklyTrendsChart: React.FC<WeeklyTrendsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorHandouts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#CB3CFF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#CB3CFF" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7F25FB" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#7F25FB" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#343B4F" />
        <XAxis dataKey="name" stroke="#AEB9E1" />
        <YAxis stroke="#AEB9E1" />
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
        <Legend wrapperStyle={{ color: "#FFFFFF" }} />
        <Area
          type="monotone"
          dataKey="handouts"
          stroke="#CB3CFF"
          fillOpacity={1}
          fill="url(#colorHandouts)"
          name="Handouts"
        />
        <Area
          type="monotone"
          dataKey="collections"
          stroke="#7F25FB"
          fillOpacity={1}
          fill="url(#colorCollections)"
          name="Collections"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WeeklyTrendsChart;
