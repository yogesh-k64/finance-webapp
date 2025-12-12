import { Tabs, Tab } from "@mui/material";
import { useMemo } from "react";
import { getCurrentMonthWeeks } from "../utils/utilsFunction";
import type { WeekSelectorProps } from "../utils/interface";

function WeekSelector({
  selectedWeek,
  onWeekChange,
  disabled = false,
  isMobile = false,
}: WeekSelectorProps) {
  const weeks = useMemo(() => getCurrentMonthWeeks(), []);

  return (
    <Tabs
      value={selectedWeek}
      onChange={onWeekChange}
      variant="scrollable"
      scrollButtons="auto"
      className={`week-tabs ${disabled ? "disabled" : ""}`}
    >
      {weeks.map((week) => (
        <Tab
          key={week.weekNumber}
          label={isMobile ? `W${week.weekNumber}` : `Week ${week.weekNumber}`}
          value={week.weekNumber}
          className={isMobile ? "week-tab week-tab-mobile" : "week-tab"}
        />
      ))}
    </Tabs>
  );
}

export default WeekSelector;
