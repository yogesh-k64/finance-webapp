import { Checkbox, FormControlLabel } from "@mui/material";
import DatePicker from "react-multi-date-picker";
import { DATE_PICKER_FORMAT } from "../utils/constants";
import { formatDateRange } from "../utils/utilsFunction";
import type { FilterControlsProps } from "../utils/interface";

function FilterControls({
  checked,
  onShowAllChange,
  dateValues,
  onDateChange,
}: FilterControlsProps) {
  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onShowAllChange} />}
        label="Show All"
        className="show-all-checkbox"
      />
      <DatePicker
        format={DATE_PICKER_FORMAT}
        value={dateValues}
        onChange={onDateChange}
        range
        className="custom-date-picker-calendar"
        containerClassName="custom-date-picker-container"
        calendarPosition="bottom-center"
        portal
        render={(value: string, openCalendar: () => void) => {
          return (
            <button
              onClick={openCalendar}
              className={`custom-datepicker-input`}
            >
              {value ? formatDateRange(value) : "Custom Date"}
            </button>
          );
        }}
      />
    </>
  );
}

export default FilterControls;
