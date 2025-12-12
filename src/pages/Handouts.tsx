import { Grid, Button, Popover, IconButton, Tabs, Tab } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { SCREENS, handoutsInitialFormData } from "../utils/constants";
import type { CreateHandoutReq, HeadCell } from "../utils/interface";
import { useHandoutsList } from "../store/handoutsSlice";
import { useIsMobile } from "../store/AppConfigReducer";
import { useSelector } from "react-redux";
import { useUserList } from "../store/customerSlice";
import type { DateObject } from "react-multi-date-picker";

import FormDataComp, { type FormField } from "./FormDataComp";
import TableComponentV1 from "../common/TableComponent";
import DialogComponent from "../common/DialogComponent";
import FilterControls from "../components/FilterControls";
import { handoutMobileHeadCell } from "../utils/mobileTableCells";
import { getHandoutSummary, formatNumber } from "../utils/utilsFunction";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useMemo } from "react";
import { HandoutRespClass } from "../responseClass/HandoutResp";
import useHandoutApi from "../hooks/useHandoutApi";
import DotLoader from "../common/DotLoader";

function Handouts() {
  const navigate = useNavigate();
  const allHandouts = useSelector(useHandoutsList);
  const userList = useSelector(useUserList);
  const isMobile = useSelector(useIsMobile);
  
  const [dateRange, setDateRange] = useState<DateObject[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(handoutsInitialFormData);
  const editId = useRef<number | null>(null);
  const { createHandout, updateHandout, deleteHandout, loading } = useHandoutApi();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  // Get current week number for default selection
  const getCurrentWeekNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let weekNumber = 1;
    let weekStart = new Date(firstDay);
    let weekEnd = new Date(firstDay);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    while (weekEnd <= lastDay) {
      if (now >= weekStart && now <= (weekEnd > lastDay ? lastDay : weekEnd)) {
        return weekNumber;
      }
      weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() + 1);
      weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekNumber++;
    }
    
    return weekNumber;
  };
  
  const [selectedWeek, setSelectedWeek] = useState<number | null>(getCurrentWeekNumber());
  const [filterMode, setFilterMode] = useState<'all' | 'date' | 'week'>('week');

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  const updateDateRange = (newDateRange: DateObject[]) => {
    if (newDateRange && newDateRange.length > 0) {
      setDateRange(newDateRange);
      setFilterMode('date');
      setSelectedWeek(null); // Clear week selection
      setChecked(false);
    }
  };

  // Get weeks of current month
  const getCurrentMonthWeeks = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first and last day of current month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const weeks: { weekNumber: number; startDate: Date; endDate: Date }[] = [];
    let weekNumber = 1;
    const currentDate = new Date(firstDay);
    
    while (currentDate <= lastDay) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // If week end goes beyond month, cap it at last day of month
      if (weekEnd > lastDay) {
        weeks.push({ weekNumber, startDate: weekStart, endDate: new Date(lastDay) });
        break;
      } else {
        weeks.push({ weekNumber, startDate: weekStart, endDate: weekEnd });
      }
      
      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }
    
    return weeks;
  }, []);

  const handleWeekChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setSelectedWeek(newValue);
    if (newValue !== null) {
      setFilterMode('week');
      setDateRange([]); // Clear date picker
      setChecked(false);
    }
  };

  const ERROR_MSG = {
    user: "User is required",
    amount: "Valid amount required",
    date: "Date is required",
  };

  const handleSelectChange = useCallback((evt: any) => {
    const {
      target: { value, name },
    } = evt;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: "" },
    }));
  }, []);

  const userOptions = useMemo(
    () =>
      userList.map((item) => ({
        value: String(item.getId()),
        label: item.getName(),
      })),
    [userList]
  );

  const formFields: FormField[] = useMemo(
    () => [
      {
        name: "user",
        label: "User",
        type: "dropDown",
        required: true,
        options: userOptions,
        handleSelectChange: handleSelectChange,
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        required: true,
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        required: true,
        InputLabelProps: { shrink: true },
        className: "form-group-full",
      },
    ],
    [userOptions, handleSelectChange]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: "" },
    }));
  }, []);

  const validateForm = () => {
    const isUserNotValid = formData.user.value.trim() === "";
    const isAmountNotValid =
      formData.amount.value.trim() === "" ||
      isNaN(Number(formData.amount.value));
    const isDateNotValid = formData.date.value.trim() === "";

    setFormData((prev) => ({
      ...prev,
      user: {
        value: prev.user.value,
        errorMsg: isUserNotValid ? ERROR_MSG.user : "",
      },
      amount: {
        value: prev.amount.value,
        errorMsg: isAmountNotValid ? ERROR_MSG.amount : "",
      },
      date: {
        value: prev.date.value,
        errorMsg: isDateNotValid ? ERROR_MSG.date : "",
      },
    }));

    return !isUserNotValid && !isAmountNotValid && !isDateNotValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const handoutObj: CreateHandoutReq = {
        amount: Number(formData.amount.value),
        date: new Date(formData.date.value).toISOString(),
        userId: Number(formData.user.value),
      };
      if (editId.current) {
        updateHandout(editId.current, handoutObj);
      } else {
        createHandout(handoutObj);
      }

      setFormData(handoutsInitialFormData);
      editId.current = null;
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(handoutsInitialFormData);
    editId.current = null;
  };

  const [fromDate, endDate] = dateRange;
  const fromDateObj = new Date(fromDate?.toString());
  const endDateObj = new Date(endDate?.toString());

  const handoutsRespList = allHandouts.map(
    (item) => new HandoutRespClass(item)
  );

  const filteredHandouts = handoutsRespList.reduce((acc, item) => {
    const handoutDate = item.getHandout().getDate();
    
    if (checked) {
      acc.push(item);
    } else if (selectedWeek !== null) {
      // Filter by selected week
      const week = getCurrentMonthWeeks.find(w => w.weekNumber === selectedWeek);
      if (week && handoutDate >= week.startDate && handoutDate <= week.endDate) {
        acc.push(item);
      }
    } else if (
      fromDateObj &&
      endDateObj &&
      handoutDate >= fromDateObj &&
      handoutDate <= endDateObj
    ) {
      acc.push(item);
    }
    
    return acc;
  }, [] as HandoutRespClass[]);

  const handoutsSummary = getHandoutSummary(
    filteredHandouts,
    fromDateObj,
    endDateObj
  );

  const { total, givenToCustomer, profit } = handoutsSummary;

  const headCell: HeadCell[] = [
    { label: "Handout ID", renderValue: "getHandout.getId" },
    { label: "User Name", renderValue: "getUser.getName" },
    { label: "User ID", renderValue: "getUser.getId" },
    { label: "Mobile", renderValue: "getUser.getMobile" },
    { label: "Amount", renderValue: "getHandout.getDispAmount" },
    { label: "Date", renderValue: "getHandout.getDateStr" },
    { label: "Updated At", renderValue: "getHandout.getUpdatedAt" },
  ];

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      // Show all data
      setFilterMode('all');
      setSelectedWeek(null);
      setDateRange([]);
    } else {
      // Select current week when unchecked
      const currentWeekNumber = getCurrentWeekNumber();
      setSelectedWeek(currentWeekNumber);
      setFilterMode('week');
      setDateRange([]);
    }
  };

  const summaryList = [
    { title: "Total Amount", value: total },
    { title: "Handout Amount", value: givenToCustomer },
    { title: "Profit", value: profit },
  ];

  return (
    <div className="handouts-container">
      <Grid container justifyContent={"space-between"} className="summary-grid">
        {summaryList.map((item) => {
          return (
            <Grid size={3} key={item.title} className="summary-item">
              <div className="item-box">
                <div className="title">{item.title}</div>
                <div className="value">
                  {formatNumber(item.value, { lakh: false })}
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className="table-section">
        <div className="header-section">
          <div className="week-tabs-container">
            <span className="title label-title">
              Handouts Records
              {loading && (
                <DotLoader />
              )}
            </span>
            <Tabs
              value={selectedWeek}
              onChange={handleWeekChange}
              variant="scrollable"
              scrollButtons="auto"
              className={`week-tabs ${filterMode === 'date' ? 'disabled' : ''}`}
            >
              {getCurrentMonthWeeks.map((week) => (
                <Tab
                  key={week.weekNumber}
                  label={isMobile ? `W${week.weekNumber}` : `Week ${week.weekNumber}`}
                  value={week.weekNumber}
                  className={isMobile ? "week-tab week-tab-mobile" : "week-tab"}
                />
              ))}
            </Tabs>
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
                  slotProps={{
                    paper: {
                      style: {
                        marginTop: '8px',
                      },
                    },
                  }}
                >
                  <div className="filter-popover-content">
                    <FilterControls
                      checked={checked}
                      onShowAllChange={handleShowAll}
                      dateValues={filterMode === 'date' ? dateRange : []}
                      onDateChange={updateDateRange}
                    />
                  </div>
                </Popover>
              </>
            ) : (
              <FilterControls
                checked={checked}
                onShowAllChange={handleShowAll}
                dateValues={filterMode === 'date' ? dateRange : []}
                onDateChange={updateDateRange}
              />
            )}
            <Button
              variant="contained"
              className="action-btn"
              onClick={handleOpenDialog}
            >
              {isMobile ? "Add" : "Add New Handout"}
            </Button>
          </div>
        </div>
        <TableComponentV1
          headCell={isMobile ? handoutMobileHeadCell : headCell}
          list={filteredHandouts}
          loading={loading}
          onEdit={(item: HandoutRespClass) => {
            editId.current = item.getHandout().getId();
            setFormData({
              user: { value: String(item.getUser().getId()), errorMsg: "" },
              amount: {
                value: String(item.getHandout().getAmount()),
                errorMsg: "",
              },
              date: {
                value: item.getHandout().getDate().toISOString().split("T")[0],
                errorMsg: "",
              },
            });
            setOpenDialog(true);
          }}
          onDelete={(item: HandoutRespClass) => {
            deleteHandout(item.getHandout().getId());
          }}
          onClick={(item: HandoutRespClass) =>
            navigate(`${SCREENS.HANDOUTS}/${item.getHandout().getId()}`)
          }
        />
      </div>

      <DialogComponent
        open={openDialog}
        onClose={handleCloseDialog}
        title={editId.current ? "Update Handout" : "Add New Handout"}
      >
        <FormDataComp
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formFields={formFields}
          buttonText={editId.current ? "Update Handout" : "Add Handout"}
        />
      </DialogComponent>
    </div>
  );
}

export default Handouts;
