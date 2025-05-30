import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE } from "../utils/constants"

import DatePicker from "react-multi-date-picker"
import DrawerSection from "../components/DrawerSection"
import { Grid } from "@mui/material"
import { Outlet } from "react-router-dom"
import { formatDateRange } from "../utils/utilsFunction"
import { useState } from "react"

const DashBoard = () => {
  const [values, setValues] = useState(INITIAL_FILTER_DATE)

  return (
    <Grid container className="main-container" >
      <Grid size={2} p={3} className="drawer-section" >
        <DrawerSection />
      </Grid>
      <Grid size={10} p={3} className="content-section">
        <div className="header" >
          <DatePicker
            format={DATE_PICKER_FORMAT}
            value={values}
            onChange={setValues}
            range
            render={(value: string, openCalendar: () => void) => {
              return (
                <button onClick={openCalendar} className="custom-datepicker-input">
                  {formatDateRange(value)}
                </button>
              );
            }}
          />
        </div>
        <Outlet />
      </Grid>
    </Grid>
  )
}

export default DashBoard