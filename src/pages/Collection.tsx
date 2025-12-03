import { Grid, Button, Popover, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { HeadCell } from "../utils/interface";
import { useCollectionList } from "../store/collectionSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useHomeDateRange,
  storeHomePageDateRange,
  useIsMobile,
} from "../store/AppConfigReducer";
import type { DateObject } from "react-multi-date-picker";

import FormDataComp, { type FormField } from "./FormDataComp";
import FilterControls from "../components/FilterControls";
import DialogComponent from "../common/DialogComponent";
import { collectionInitialFormData } from "../utils/constants";
import TableComponentV1 from "../common/TableComponent";
import { collectionMobileHeadCell } from "../utils/mobileTableCells";
import { getCollectionSummary, formatNumber } from "../utils/utilsFunction";
import { useState, useRef } from "react";
import useCollectionApi, {
  type CreateCollectionRequest,
} from "../hooks/useCollectionApi";
import type { CollectionClass } from "../responseClass/CollectionClass";

function Collection() {
  const allCollectionList = useSelector(useCollectionList);
  const dispatch = useDispatch();
  const values = useSelector(useHomeDateRange);
  const isMobile = useSelector(useIsMobile);
  const [checked, setChecked] = useState<boolean>(true); // Default to Show All
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(collectionInitialFormData);
  const editId = useRef<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { createCollection, updateCollection, deleteCollection } =
    useCollectionApi();

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
    name: "Name is required",
    amount: "Valid amount required",
    date: "Date is required",
    handoutId: "HandoutId is required",
  };

  const formFields: FormField[] = [
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
      name: "handoutId",
      label: "HandoutId",
      type: "text",
      required: true,
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
    const isAmountNotValid =
      formData.amount.value.trim() === "" ||
      isNaN(Number(formData.amount.value));
    const isDateNotValid = formData.date.value.trim() === "";
    const isHandoutIdNotValid = formData.handoutId.value.trim() === "";

    setFormData((prev) => ({
      ...prev,
      amount: {
        value: prev.amount.value,
        errorMsg: isAmountNotValid ? ERROR_MSG.amount : "",
      },
      date: {
        value: prev.date.value,
        errorMsg: isDateNotValid ? ERROR_MSG.date : "",
      },
      handoutId: {
        value: prev.handoutId.value,
        errorMsg: isHandoutIdNotValid ? ERROR_MSG.handoutId : "",
      },
    }));

    return !isAmountNotValid && !isDateNotValid && !isHandoutIdNotValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newCollection = {
        amount: Number(formData.amount.value),
        date: new Date(formData.date.value).toISOString(),
        handoutId: Number(formData.handoutId.value),
      } as CreateCollectionRequest;

      if (editId.current) {
        updateCollection(Number(editId.current), newCollection);
      } else {
        createCollection(newCollection);
      }

      setFormData(collectionInitialFormData);
      editId.current = null;
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(collectionInitialFormData);
    editId.current = null;
  };

  const headCell: HeadCell[] = [
    { label: "ID", renderValue: "getId" },
    { label: "Amount", renderValue: "getAmount" },
    { label: "Date", renderValue: "getDateStr" },
    { label: "Handout ID", renderValue: "getHandoutId" },
    { label: "Updated At", renderValue: "getUpdatedAt" },
  ];

  const [fromDate, endDate] = values;
  const fromDateObj = new Date(fromDate?.toString());
  const endDateObj = new Date(endDate?.toString());

  const collectionList = allCollectionList.reduce((acc, item) => {
    if (checked) acc.push(item);
    else if (
      fromDateObj &&
      endDateObj &&
      new Date(item.getDate()) >= fromDateObj &&
      new Date(item.getDate()) <= endDateObj
    ) {
      acc.push(item);
    }
    return acc;
  }, [] as CollectionClass[]);
  const { total } = getCollectionSummary(
    collectionList,
    fromDateObj,
    endDateObj
  );

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const summaryList = [{ title: "Collected Amount", value: total }];

  return (
    <div className="handouts-container">
      <Grid container justifyContent={"space-between"} className="summary-grid">
        {summaryList.map((item) => {
          return (
            <Grid size={3} key={item.title} className="summary-item">
              <div className="item-box">
                <div className="title">{item.title}</div>
                <div className="value">{formatNumber(item.value)}</div>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className="table-section">
        <div className="header-section">
          <span className="title label-title">Collection Records</span>
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
              {isMobile ? "Add" : "Add New Collection"}
            </Button>
          </div>
        </div>
        <TableComponentV1
          headCell={isMobile ? collectionMobileHeadCell : headCell}
          list={collectionList}
          onDelete={(item: CollectionClass) => {
            deleteCollection(item.getId());
          }}
          onEdit={(item: CollectionClass) => {
            editId.current = item.getId();
            setFormData({
              amount: { value: String(item.getAmount() || ""), errorMsg: "" },
              date: {
                value: item.getDate().toISOString().split("T")[0] || "",
                errorMsg: "",
              },
              handoutId: {
                value: String(item.getHandoutId()) || "",
                errorMsg: "",
              },
            });
            setOpenDialog(true);
          }}
        />
      </div>

      <DialogComponent
        open={openDialog}
        onClose={handleCloseDialog}
        title={editId.current ? "Update Collection" : "Add New Collection"}
      >
        <FormDataComp
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formFields={formFields}
          buttonText={editId.current ? "Update Collection" : "Add Collection"}
        />
      </DialogComponent>
    </div>
  );
}

export default Collection;
