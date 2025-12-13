import {
  getCollectionSummary,
  getHandoutSummary,
  formatNumber,
} from "../utils/utilsFunction";
import { STATUS_TYPES } from "../utils/constants";

import { Grid } from "@mui/material";
import { useCollectionList } from "../store/collectionSlice";
import { useHandoutsList } from "../store/handoutsSlice";
import { useUserList } from "../store/customerSlice";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MetricCard from "../common/MetricCard";
import ChartCard from "../common/ChartCard";
import StatCard from "../common/StatCard";
import WeeklyTrendsChart from "../common/WeeklyTrendsChart";
import CollectionRateChart from "../common/CollectionRateChart";
import TopUsersChart from "../common/TopUsersChart";
import FinancialDistributionChart from "../common/FinancialDistributionChart";

const HomePage = () => {
  const allHandouts = useSelector(useHandoutsList);
  const allCollectionList = useSelector(useCollectionList);
  const allUsers = useSelector(useUserList);

  const handoutsSummary = getHandoutSummary(allHandouts);
  const collectionSummary = getCollectionSummary(allCollectionList);

  const balance = collectionSummary.total - handoutsSummary.givenToCustomer;
  const collectionRate = handoutsSummary.total > 0 
    ? (collectionSummary.total / handoutsSummary.total) * 100 
    : 0;

  // Calculate status-based counts
  const activeHandouts = allHandouts.filter(h => h.getHandout().getStatus() === STATUS_TYPES.ACTIVE).length;
  const completedHandouts = allHandouts.filter(h => h.getHandout().getStatus() === STATUS_TYPES.COMPLETED).length;
  const bondHandouts = allHandouts.filter(h => h.getHandout().getBond()).length;

  // Prepare data for weekly trends
  const weeklyData = useMemo(() => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const data = weeks.map((week, index) => {
      // Group data by weeks
      const weekStart = new Date();
      weekStart.setDate(1 + index * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekHandouts = allHandouts.filter((item) => {
        const date = item.getHandout().getDate();
        return date >= weekStart && date <= weekEnd;
      });

      const weekCollections = allCollectionList.filter((item) => {
        const date = new Date(item.getDate());
        return date >= weekStart && date <= weekEnd;
      });

      const handoutsSum = weekHandouts.reduce(
        (sum, item) => sum + item.getHandout().getAmount(),
        0
      );
      const collectionsSum = weekCollections.reduce(
        (sum, item) => sum + item.getAmount(),
        0
      );

      return {
        name: week,
        handouts: handoutsSum,
        collections: collectionsSum,
      };
    });
    return data;
  }, [allHandouts, allCollectionList]);

  // Prepare data for user distribution
  const userDistribution = useMemo(() => {
    const userMap = new Map();
    allHandouts.forEach((handout) => {
      const userId = handout.getUser()?.getId();
      const userName = handout.getUser()?.getName() || "Unknown";
      const amount = handout.getHandout().getAmount();
      
      if (userId) {
        userMap.set(userId, {
          name: userName,
          value: (userMap.get(userId)?.value || 0) + amount,
        });
      }
    });
    return Array.from(userMap.values()).slice(0, 5);
  }, [allHandouts]);

  // Pie chart data for collection vs handouts
  const pieData = [
    { name: "Collections", value: collectionSummary.total },
    { name: "Handouts", value: handoutsSummary.total },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <div className="date-info">{new Date().toLocaleDateString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })}</div>
      </div>

      {/* Key Metrics Cards */}
      <Grid container spacing={2.5} className="metrics-grid">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            icon={<TrendingUpIcon />}
            label="Total Handouts"
            value={formatNumber(handoutsSummary.total)}
            subtitle={`${allHandouts.length} transactions`}
            variant="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            icon={<TrendingUpIcon />}
            label="Total Collections"
            value={`${formatNumber(collectionSummary.total)}`}
            subtitle={`${allCollectionList.length} payments received`}
            variant="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            icon={balance >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label="Balance"
            value={formatNumber(Math.abs(balance))}
            subtitle={balance >= 0 ? "Surplus" : "Deficit"}
            variant={balance >= 0 ? "warning" : "danger"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            icon={<TrendingUpIcon />}
            label="Total Profit"
            value={formatNumber(handoutsSummary.profit)}
            subtitle={`From ${allHandouts.length} handouts`}
            variant="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2.5} className="charts-grid">
        {/* Weekly Trend Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartCard title="Weekly Trends">
            <WeeklyTrendsChart data={weeklyData} />
          </ChartCard>
        </Grid>

        {/* Collection Rate Circular Progress */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ChartCard title="Collection Rate">
            <CollectionRateChart collectionRate={collectionRate} />
          </ChartCard>
        </Grid>

        {/* Top Users Bar Chart */}
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <ChartCard title="Top Users by Handouts">
            <TopUsersChart data={userDistribution} />
          </ChartCard>
        </Grid>

        {/* Pie Chart Distribution */}
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <ChartCard title="Financial Distribution">
            <FinancialDistributionChart data={pieData} />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={2.5} className="stats-grid">
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Users"
            value={allUsers.length}
            description="Registered users"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Active Handouts"
            value={activeHandouts}
            description="Currently active"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Completed"
            value={completedHandouts}
            description="Handouts completed"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="With Bond"
            value={bondHandouts}
            description="Handouts with bond"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
