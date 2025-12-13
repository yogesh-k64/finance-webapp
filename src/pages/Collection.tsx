import { Grid } from "@mui/material";
import { useCollectionList } from "../store/collectionSlice";
import { useSelector } from "react-redux";
import { useIsMobile } from "../store/AppConfigReducer";
import type { DateObject } from "react-multi-date-picker";

import FormDataComp, { type FormField } from "./FormDataComp";
import DialogComponent from "../common/DialogComponent";
import PageHeader from "../common/PageHeader";
import { collectionInitialFormData } from "../utils/constants";
import TableComponentV1 from "../common/TableComponent";
import { collectionHeadCell } from "../utils/tableHeadCells";
import { collectionErrorMessages } from "../utils/errorMessages";
import { collectionMobileHeadCell } from "../utils/mobileTableCells";
import {
  getCollectionSummary,
  formatNumber,
  getCurrentWeekNumber,
  getCurrentMonthWeeks,
} from "../utils/utilsFunction";
import { useState, useRef, useMemo } from "react";
import useCollectionApi, {
  type CreateCollectionRequest,
} from "../hooks/useCollectionApi";
import type { CollectionClass } from "../responseClass/CollectionClass";

function Collection() {
  const allCollectionList = useSelector(useCollectionList);
  const isMobile = useSelector(useIsMobile);

  const [dateRange, setDateRange] = useState<DateObject[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(collectionInitialFormData);
  const editId = useRef<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(
    getCurrentWeekNumber()
  );
  const [filterMode, setFilterMode] = useState<"all" | "date" | "week">("week");
  const { createCollection, updateCollection, deleteCollection, loading } =
    useCollectionApi();

  const weeks = useMemo(() => getCurrentMonthWeeks(), []);

  const updateDateRange = (newDateRange: DateObject[]) => {
    if (newDateRange && newDateRange.length > 0) {
      setDateRange(newDateRange);
      setFilterMode("date");
      setSelectedWeek(null);
      setChecked(false);
    }
  };

  const handleWeekChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setSelectedWeek(newValue);
    if (newValue !== null) {
      setFilterMode("week");
      setDateRange([]);
      setChecked(false);
    }
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
        errorMsg: isAmountNotValid ? collectionErrorMessages.amount : "",
      },
      date: {
        value: prev.date.value,
        errorMsg: isDateNotValid ? collectionErrorMessages.date : "",
      },
      handoutId: {
        value: prev.handoutId.value,
        errorMsg: isHandoutIdNotValid ? collectionErrorMessages.handoutId : "",
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

  const [fromDate, endDate] = dateRange;
  const fromDateObj = new Date(fromDate?.toString());
  const endDateObj = new Date(endDate?.toString());

  const collectionList = allCollectionList.reduce((acc, item) => {
    const collectionDate = new Date(item.getDate());

    if (checked) {
      acc.push(item);
    } else if (selectedWeek !== null) {
      // Filter by selected week
      const week = weeks.find((w) => w.weekNumber === selectedWeek);
      if (
        week &&
        collectionDate >= week.startDate &&
        collectionDate <= week.endDate
      ) {
        acc.push(item);
      }
    } else if (
      fromDateObj &&
      endDateObj &&
      collectionDate >= fromDateObj &&
      collectionDate <= endDateObj
    ) {
      acc.push(item);
    }
    return acc;
  }, [] as CollectionClass[]);
  const { total } = getCollectionSummary(collectionList);

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setFilterMode("all");
      setSelectedWeek(null);
      setDateRange([]);
    } else {
      const currentWeekNumber = getCurrentWeekNumber();
      setSelectedWeek(currentWeekNumber);
      setFilterMode("week");
      setDateRange([]);
    }
  };

  const summaryList = [
    { title: `Collected Amount (${collectionList.length})`, value: total }
  ];

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
        <PageHeader
          title="Collection Records"
          loading={loading}
          selectedWeek={selectedWeek}
          onWeekChange={handleWeekChange}
          filterMode={filterMode}
          checked={checked}
          onShowAllChange={handleShowAll}
          dateValues={filterMode === "date" ? dateRange : []}
          onDateChange={updateDateRange}
          isMobile={isMobile}
          addButtonText="Add New Collection"
          onAddClick={handleOpenDialog}
        />
        <TableComponentV1
          headCell={isMobile ? collectionMobileHeadCell : collectionHeadCell}
          list={collectionList}
          loading={loading}
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
