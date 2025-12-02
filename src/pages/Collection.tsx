import {
  Grid,
  Button,
  Popover,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { HeadCell, collection } from "../utils/interface";
import {
  removeCollection,
  useCollectionList,
  loadCollection,
} from "../store/collectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { addCollection } from "../store/collectionSlice";
import {
  showSnackBar,
  useHomeDateRange,
  storeHomePageDateRange,
  useIsMobile,
} from "../store/AppConfigReducer";
import { v4 as uuidv4 } from "uuid";
import type { DateObject } from "react-multi-date-picker";

import FormDataComp, { type FormField } from "./FormDataComp";
import FilterControls from "../components/FilterControls";
import DialogComponent from "../common/DialogComponent";
import {
  collectionInitialFormData,
} from "../utils/constants";
import TableComponentV1 from "../common/TableComponent";
import { collectionMobileHeadCell } from "../utils/mobileTableCells";
import { getCollectionSummary, formatNumber } from "../utils/utilsFunction";
import { useState, useRef, useEffect } from "react";
import dummyCollections from "../data/dummyCollections.json";

function Collection() {
  const allCollectionList = useSelector(useCollectionList);
  const dispatch = useDispatch();
  const values = useSelector(useHomeDateRange);
  const isMobile = useSelector(useIsMobile);
  const [checked, setChecked] = useState<boolean>(true); // Default to Show All
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(collectionInitialFormData);
  const editId = useRef<string | null>(null);
  const hasLoadedData = useRef(false);
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

  // Load dummy data on first mount if no collections exist
  useEffect(() => {
    if (!hasLoadedData.current && allCollectionList.length === 0) {
      dispatch(loadCollection({ items: dummyCollections as any }));
      hasLoadedData.current = true;
    }
  }, [allCollectionList.length, dispatch]);

  const ERROR_MSG = {
    name: "Name is required",
    amount: "Valid amount required",
    date: "Date is required",
    handoutId: "HandoutId is required",
  };

  const formFields: FormField[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
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
    const isNameNotValid = formData.name.value.trim() === "";
    const isAmountNotValid =
      formData.amount.value.trim() === "" ||
      isNaN(Number(formData.amount.value));
    const isDateNotValid = formData.date.value.trim() === "";
    const isHandoutIdNotValid = formData.handoutId.value.trim() === "";

    setFormData((prev) => ({
      ...prev,
      name: {
        value: prev.name.value,
        errorMsg: isNameNotValid ? ERROR_MSG.name : "",
      },
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

    return (
      !isNameNotValid &&
      !isAmountNotValid &&
      !isDateNotValid &&
      !isHandoutIdNotValid
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newCollection = {
        id: editId.current || uuidv4(),
        name: formData.name.value.trim(),
        amount: Number(formData.amount.value),
        date: formData.date.value,
        handoutId: formData.handoutId.value,
      } as collection;

      if (editId.current) {
        dispatch(
          showSnackBar({
            message: "Collection updated successfully",
            status: "success",
          })
        );
      } else {
        dispatch(
          showSnackBar({
            message: "Collection added successfully",
            status: "success",
          })
        );
      }
      dispatch(addCollection(newCollection));

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
    { label: "name" },
    { label: "amount" },
    { label: "date" },
    { label: "handoutId" },
  ];

  const [fromDate, endDate] = values;
  const fromDateObj = new Date(fromDate?.toString());
  const endDateObj = new Date(endDate?.toString());

  const collectionList = allCollectionList.reduce((acc, item) => {
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
  }, [] as collection[]);
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
          onDelete={(item: collection) => {
            dispatch(removeCollection(item.id));
          }}
          onEdit={(item: collection) => {
            editId.current = item.id;
            setFormData({
              name: { value: item.name || "", errorMsg: "" },
              amount: { value: String(item.amount || ""), errorMsg: "" },
              date: { value: item.date || "", errorMsg: "" },
              handoutId: { value: item.handoutId || "", errorMsg: "" },
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
