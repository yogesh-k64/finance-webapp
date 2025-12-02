import { Checkbox, FormControlLabel } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { DATE_PICKER_FORMAT } from "../utils/constants";
import { formatDateRange } from "../utils/utilsFunction";

interface FilterControlsProps {
  checked: boolean;
  onShowAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dateValues: DateObject[];
  onDateChange: (dateRange: DateObject[]) => void;
}

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
    </>
  );
}

export default FilterControls;
