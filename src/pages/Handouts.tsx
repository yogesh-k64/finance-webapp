import { Grid } from "@mui/material";
import { SCREENS, handoutsInitialFormData, STATUS_OPTIONS } from "../utils/constants";
import type { CreateHandoutReq } from "../utils/interface";
import { handoutsHeadCell } from "../utils/tableHeadCells";
import { handoutErrorMessages } from "../utils/errorMessages";
import { useHandoutsList } from "../store/handoutsSlice";
import { useIsMobile } from "../store/AppConfigReducer";
import { useSelector } from "react-redux";
import { useUserList } from "../store/customerSlice";
import type { DateObject } from "react-multi-date-picker";

import FormDataComp, { type FormField } from "./FormDataComp";
import TableComponentV1 from "../common/TableComponent";
import DialogComponent from "../common/DialogComponent";
import PageHeader from "../common/PageHeader";
import { handoutMobileHeadCell } from "../utils/mobileTableCells";
import { getHandoutSummary, formatNumber } from "../utils/utilsFunction";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useMemo } from "react";
import { HandoutRespClass } from "../responseClass/HandoutResp";
import useHandoutApi from "../hooks/useHandoutApi";
import {
  getCurrentWeekNumber,
  getCurrentMonthWeeks,
} from "../utils/utilsFunction";

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
  const { createHandout, updateHandout, deleteHandout, loading } =
    useHandoutApi();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(
    getCurrentWeekNumber()
  );
  const [filterMode, setFilterMode] = useState<"all" | "date" | "week">("week");

  const updateDateRange = (newDateRange: DateObject[]) => {
    if (newDateRange && newDateRange.length > 0) {
      setDateRange(newDateRange);
      setFilterMode("date");
      setSelectedWeek(null); // Clear week selection
      setChecked(false);
    }
  };

  const weeks = useMemo(() => getCurrentMonthWeeks(), []);

  const handleWeekChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setSelectedWeek(newValue);
    if (newValue !== null) {
      setFilterMode("week");
      setDateRange([]); // Clear date picker
      setChecked(false);
    }
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
      {
        name: "status",
        label: "Status",
        type: "dropDown",
        required: true,
        options: STATUS_OPTIONS,
        handleSelectChange: handleSelectChange,
        className: "form-group-half",
      },
      {
        name: "bond",
        label: "Bond",
        type: "checkbox",
        required: false,
        className: "form-group-half",
      },
    ],
    [userOptions, handleSelectChange]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: type === "checkbox" ? String(checked) : value, errorMsg: "" },
    }));
  }, []);

  const validateForm = () => {
    const isUserNotValid = formData.user.value.trim() === "";
    const isAmountNotValid =
      formData.amount.value.trim() === "" ||
      isNaN(Number(formData.amount.value));
    const isDateNotValid = formData.date.value.trim() === "";
    const isStatusNotValid = formData.status.value.trim() === "";

    setFormData((prev) => ({
      ...prev,
      user: {
        value: prev.user.value,
        errorMsg: isUserNotValid ? handoutErrorMessages.user : "",
      },
      amount: {
        value: prev.amount.value,
        errorMsg: isAmountNotValid ? handoutErrorMessages.amount : "",
      },
      date: {
        value: prev.date.value,
        errorMsg: isDateNotValid ? handoutErrorMessages.date : "",
      },
      status: {
        value: prev.status.value,
        errorMsg: isStatusNotValid ? "Status is required" : "",
      },
    }));

    return !isUserNotValid && !isAmountNotValid && !isDateNotValid && !isStatusNotValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const handoutObj: CreateHandoutReq = {
        amount: Number(formData.amount.value),
        date: new Date(formData.date.value).toISOString(),
        userId: Number(formData.user.value),
        status: formData.status.value,
        bond: formData.bond.value === "true",
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

  const handoutsRespList = allHandouts

  const filteredHandouts = handoutsRespList.reduce((acc, item) => {
    const handoutDate = item.getHandout().getDate();

    if (checked) {
      acc.push(item);
    } else if (selectedWeek !== null) {
      // Filter by selected week
      const week = weeks.find((w) => w.weekNumber === selectedWeek);
      if (
        week &&
        handoutDate >= week.startDate &&
        handoutDate <= week.endDate
      ) {
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

  const handoutsSummary = getHandoutSummary(filteredHandouts);

  const { total, profit, statusBreakdown } = handoutsSummary;

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      // Show all data
      setFilterMode("all");
      setSelectedWeek(null);
      setDateRange([]);
    } else {
      // Select current week when unchecked
      const currentWeekNumber = getCurrentWeekNumber();
      setSelectedWeek(currentWeekNumber);
      setFilterMode("week");
      setDateRange([]);
    }
  };

  const summaryList = [
    { title: isMobile ? "Total" : "Total Amount", value: total },
    { title: "Profit", value: profit },
    { title: isMobile ? `Active (${statusBreakdown.active.count})` : `Active (${statusBreakdown.active.count})`, value: statusBreakdown.active.total },
    { title: isMobile ? `Done (${statusBreakdown.completed.count})` : `Completed (${statusBreakdown.completed.count})`, value: statusBreakdown.completed.total },
    { title: `Pending (${statusBreakdown.pending.count})`, value: statusBreakdown.pending.total },
    { title: isMobile ? `Cancel (${statusBreakdown.cancelled.count})` : `Cancelled (${statusBreakdown.cancelled.count})`, value: statusBreakdown.cancelled.total },
  ];

  return (
    <div className="handouts-container">
      <Grid container justifyContent={"space-between"} className="summary-grid handouts-summary">
        {summaryList.map((item) => {
          return (
            <Grid size={{ xs: 4, md: 2 }} key={item.title} className="summary-item">
              <div className="item-box">
                <div className="title">{item.title}</div>
                <div className="value">{formatNumber(item.value, { lakh: false })}</div>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className="table-section">
        <PageHeader
          title="Handouts Records"
          loading={loading}
          selectedWeek={selectedWeek}
          onWeekChange={handleWeekChange}
          filterMode={filterMode}
          checked={checked}
          onShowAllChange={handleShowAll}
          dateValues={filterMode === "date" ? dateRange : []}
          onDateChange={updateDateRange}
          isMobile={isMobile}
          addButtonText="Add New Handout"
          onAddClick={handleOpenDialog}
        />
        <TableComponentV1
          headCell={isMobile ? handoutMobileHeadCell : handoutsHeadCell}
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
              status: {
                value: item.getHandout().getStatus() || "ACTIVE",
                errorMsg: "",
              },
              bond: {
                value: String(item.getHandout().getBond()),
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
