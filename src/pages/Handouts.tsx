import {
  Checkbox,
  FormControlLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import {
  HEAD_CELL_ACTION,
  SCREENS,
  handoutsInitialFormData,
  DATE_PICKER_FORMAT,
} from "../utils/constants";
import type { Handout, HeadCell } from "../utils/interface";
import { useHandoutsList, loadHandouts } from "../store/handoutsSlice";
import {
  useHomeDateRange,
  showSnackBar,
  storeHomePageDateRange,
} from "../store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";
import DatePicker, { DateObject } from "react-multi-date-picker";

import FormDataComp, { type FormField } from "./FormDataComp";
import TableComponentV1 from "../common/TableComponent";
import { getHandoutSummary, formatDateRange } from "../utils/utilsFunction";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import dummyHandouts from "../data/dummyHandouts.json";

function Handouts() {
  const navigate = useNavigate();
  const allHandouts = useSelector(useHandoutsList);
  const values = useSelector(useHomeDateRange);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState<boolean>(true); // Default to Show All
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(handoutsInitialFormData);
  const editId = useRef<number | null>(null);
  const hasLoadedData = useRef(false);

  const updateDateRange = (dateRange: DateObject[]) => {
    dispatch(storeHomePageDateRange(dateRange));
  };

  // Load dummy data on first mount if no handouts exist
  useEffect(() => {
    if (!hasLoadedData.current && allHandouts.length === 0) {
      dispatch(loadHandouts({ items: dummyHandouts as any }));
      hasLoadedData.current = true;
    }
  }, [allHandouts.length, dispatch]);

  const ERROR_MSG = {
    name: "Name is required",
    mobile: "Valid 10-digit number required",
    nominee: "Nominee is required",
    amount: "Valid amount required",
    date: "Date is required",
    address: "Address is required",
  };

  const formFields: FormField[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "text",
      required: true,
    },
    {
      name: "nominee",
      label: "Nominee",
      type: "text",
      required: false,
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
    {
      name: "address",
      label: "Address",
      type: "text",
      required: false,
      multiline: true,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: "" },
    }));
  };

  const validateForm = () => {
    const isNameNotValid = formData.name.value.trim() === "";
    const isMobileNotValid =
      formData.mobile.value.trim() === "" ||
      !/^\d{10}$/.test(formData.mobile.value);
    const isAmountNotValid =
      formData.amount.value.trim() === "" ||
      isNaN(Number(formData.amount.value));
    const isDateNotValid = formData.date.value.trim() === "";

    setFormData((prev) => ({
      ...prev,
      name: {
        value: prev.name.value,
        errorMsg: isNameNotValid ? ERROR_MSG.name : "",
      },
      mobile: {
        value: prev.mobile.value,
        errorMsg: isMobileNotValid ? ERROR_MSG.mobile : "",
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

    return (
      !isNameNotValid &&
      !isMobileNotValid &&
      !isAmountNotValid &&
      !isDateNotValid
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (editId.current) {
        dispatch(
          showSnackBar({
            message: "Handout updated successfully",
            status: "success",
          })
        );
      } else {
        dispatch(
          showSnackBar({
            message: "Handout added successfully",
            status: "success",
          })
        );
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

  const handouts = allHandouts.reduce((acc, item) => {
    if (checked) acc.push(item);
    else if (
      fromDateObj &&
      endDateObj &&
      new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj
    ) {
      acc.push(item);
    }
    return acc;
  }, [] as Handout[]);
  const handoutsSummary = getHandoutSummary(handouts, fromDateObj, endDateObj);

  const { total, givenToCustomer, profit } = handoutsSummary;

  const headCell: HeadCell[] = [
    { label: "name" },
    { label: "mobile" },
    { label: "nominee" },
    { label: "amount" },
    { label: "date" },
    { label: "id" },
    { label: "address" },
    {
      label: HEAD_CELL_ACTION,
      onDelete: (item: Handout) => {
        console.log("item delete:", item);
        // dispatch(removeHandout(item.id));
      },
      onEdit: (item: any) => {
        editId.current = item.id;
        setFormData({
          name: { value: item.name || "", errorMsg: "" },
          mobile: { value: String(item.mobile || ""), errorMsg: "" },
          nominee: { value: item.nominee || "", errorMsg: "" },
          amount: { value: String(item.amount || ""), errorMsg: "" },
          date: { value: item.date || "", errorMsg: "" },
          address: { value: item.address || "", errorMsg: "" },
        });
        setOpenDialog(true);
      },
    },
  ];

  const handleClick = (item: Handout) => {
    navigate(`${SCREENS.HANDOUTS}/${item.id}`);
  };

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
      <Grid container justifyContent={"space-between"}>
        {summaryList.map((item) => {
          return (
            <Grid size={3} key={item.title} className="summay-item">
              <div className="item-box">
                <div className="title">{item.title}</div>
                <div className="value">{item.value}</div>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className="table-section">
        <div className="header-section">
          <span className="title label-title">Handouts Records</span>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleShowAll} />}
              label="Show All"
              className="show-all-checkbox"
            />
            <DatePicker
              format={DATE_PICKER_FORMAT}
              value={values}
              onChange={updateDateRange}
              range
              render={(value: string, openCalendar: () => void) => {
                return (
                  <button
                    onClick={openCalendar}
                    className="custom-datepicker-input"
                  >
                    {formatDateRange(value)}
                  </button>
                );
              }}
            />
            <Button
              variant="contained"
              className="action-btn"
              onClick={handleOpenDialog}
            >
              Add New Handout
            </Button>
          </div>
        </div>
        <TableComponentV1
          headCell={headCell}
          list={handouts}
          onClick={handleClick}
        />
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        className="custom-dialog"
      >
        <DialogTitle>
          {editId.current ? "Update Handout" : "Add New Handout"}
        </DialogTitle>
        <DialogContent>
          <FormDataComp
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formFields={formFields}
            buttonText={editId.current ? "Update Handout" : "Add Handout"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Handouts;
