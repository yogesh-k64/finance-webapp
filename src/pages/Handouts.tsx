import { Grid, Button, Popover, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { SCREENS, handoutsInitialFormData } from "../utils/constants";
import type { CreateHandoutReq, HeadCell } from "../utils/interface";
import { useHandoutsList } from "../store/handoutsSlice";
import {
  useHomeDateRange,
  storeHomePageDateRange,
  useIsMobile,
} from "../store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";
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

function Handouts() {
  const navigate = useNavigate();
  const allHandouts = useSelector(useHandoutsList);
  const userList = useSelector(useUserList);
  const values = useSelector(useHomeDateRange);
  const isMobile = useSelector(useIsMobile);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(handoutsInitialFormData);
  const editId = useRef<number | null>(null);
  const { createHandout, updateHandout, deleteHandout } = useHandoutApi();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  const updateDateRange = (dateRange: DateObject[]) => {
    dispatch(storeHomePageDateRange(dateRange));
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

  const [fromDate, endDate] = values;
  const fromDateObj = new Date(fromDate?.toString());
  const endDateObj = new Date(endDate?.toString());

  const handoutsRespList = allHandouts.map(
    (item) => new HandoutRespClass(item)
  );

  const filteredHandouts = handoutsRespList.reduce((acc, item) => {
    const handoutDate = item.getHandout().getDate();
    if (checked) acc.push(item);
    else if (
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
    { label: "Amount", renderValue: "getHandout.getAmount" },
    { label: "Date", renderValue: "getHandout.getDateStr" },
    { label: "Created At", renderValue: "getHandout.getCreatedAt" },
    { label: "Updated At", renderValue: "getHandout.getUpdatedAt" },
  ];

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
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
          <span className="title label-title">Handouts Records</span>
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
                      onShowAllChange={handleShowAll}
                      dateValues={values}
                      onDateChange={updateDateRange}
                    />
                  </div>
                </Popover>
              </>
            ) : (
              <FilterControls
                checked={checked}
                onShowAllChange={handleShowAll}
                dateValues={values}
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
