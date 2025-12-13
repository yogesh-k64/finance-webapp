import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  variant: "primary" | "success" | "warning" | "danger" | "info";
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  variant,
}) => {
  return (
    <div className={`metric-card ${variant}`}>
      <div className="metric-icon">
        {icon}
      </div>
      <div className="metric-content">
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

export default MetricCard;
