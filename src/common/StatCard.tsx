import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">{value}</div>
      <div className="stat-description">{description}</div>
    </div>
  );
};

export default StatCard;
