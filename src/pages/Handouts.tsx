import { Checkbox, FormControlLabel } from "@mui/material";
import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE, SCREENS } from "../utils/constants";
import DatePicker, { DateObject } from "react-multi-date-picker"
import { Link, useNavigate } from 'react-router-dom';

import FormDataComp from './FormDataComp';
import type { Handout } from "../utils/interface";
import TableComponentV1 from "../common/TableComponent";
import { getHandoutSummary } from "../utils/utilsFunction";
import { useHandoutsList } from '../store/handoutsSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Handouts() {
  const navigate = useNavigate();
  const allHandouts = useSelector(useHandoutsList);
  const [values, setValues] = useState<Array<DateObject>>(INITIAL_FILTER_DATE)
  const [checked, setChecked] = useState<boolean>(false);

  const [fromDate, endDate] = values
  const fromDateObj = new Date(fromDate?.toString())
  const endDateObj = new Date(endDate?.toString())

  const handouts = allHandouts.reduce((acc, item) => {
    if (checked)
      acc.push(item)
    else if (fromDateObj && endDateObj && new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj) {
      acc.push(item)
    }
    return acc
  }, [] as Handout[])
  const handoutsSummary = getHandoutSummary(handouts, fromDateObj, endDateObj)

  const { total, givenToCustomer, profit } = handoutsSummary;

  const headCell = ["name", "mobile", "nominee", "amount", "date", "id", "address"]

  const handleClick = (item: Handout) => {
    navigate(`${SCREENS.HANDOUTS}/${item.id}`)
  }

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="handouts-container">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1 className='title' >Handouts Management</h1>
      </div>
      <div className="form-section">
        <h2>Add New Handout</h2>
        <FormDataComp />
      </div>

      <div className="table-section">
        <div className="header-section" >
          <span className="title" >Handouts Records</span>
          <div>
            <FormControlLabel control={<Checkbox checked={checked} onChange={handleShowAll} />}
              label="Show All" />
            <DatePicker
              disabled={checked}
              format={DATE_PICKER_FORMAT}
              value={values}
              onChange={setValues}
              range
              dateSeparator="  To  "
            />
          </div>
        </div>
        <TableComponentV1 headCell={headCell} list={handouts} onClick={handleClick} />

        <div className="given-summary">
          <p>Total given: {total}</p>
          <p>Total actual given: {givenToCustomer}</p>
          <p>Profit: {profit}</p>
        </div>
      </div>
    </div>
  );
}

export default Handouts;