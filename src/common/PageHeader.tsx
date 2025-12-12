import { Button, Popover, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import WeekSelector from "./WeekSelector";
import FilterControls from "../components/FilterControls";
import DotLoader from "./DotLoader";
import type { PageHeaderProps } from "../utils/interface";

function PageHeader({
  title,
  loading,
  selectedWeek,
  onWeekChange,
  filterMode,
  checked,
  onShowAllChange,
  dateValues,
  onDateChange,
  isMobile,
  addButtonText,
  onAddClick,
}: PageHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header-section">
      <div className="week-tabs-container">
        <span className="title label-title">
          {title}
          {loading && <DotLoader />}
        </span>
        <WeekSelector
          selectedWeek={selectedWeek}
          onWeekChange={onWeekChange}
          disabled={filterMode === "date"}
          isMobile={isMobile}
        />
      </div>
      <div className="filter-controls-wrapper">
        {isMobile ? (
          <>
            <IconButton
              onClick={handleOpenPopover}
              className="filter-icon-btn"
              color="primary"
            >
              <FilterListIcon />
            </IconButton>
            <Popover
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div className="filter-popover-content">
                <FilterControls
                  checked={checked}
                  onShowAllChange={onShowAllChange}
                  dateValues={dateValues}
                  onDateChange={onDateChange}
                />
              </div>
            </Popover>
          </>
        ) : (
          <FilterControls
            checked={checked}
            onShowAllChange={onShowAllChange}
            dateValues={dateValues}
            onDateChange={onDateChange}
          />
        )}
        <Button variant="contained" className="action-btn" onClick={onAddClick}>
          {isMobile ? "Add" : addButtonText}
        </Button>
      </div>
    </div>
  );
}

export default PageHeader;
