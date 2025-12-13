import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface CollectionRateChartProps {
  collectionRate: number;
}

const CollectionRateChart: React.FC<CollectionRateChartProps> = ({
  collectionRate,
}) => {
  return (
    <div className="circular-progress-container">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={[
              { value: collectionRate },
              { value: 100 - collectionRate },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill="#CB3CFF" />
            <Cell fill="#343B4F" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="circular-progress-label">
        <div className="progress-value">{collectionRate.toFixed(0)}%</div>
        <div className="progress-subtitle">Collected</div>
      </div>
    </div>
  );
};

export default CollectionRateChart;
