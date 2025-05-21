import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE, SCREENS } from "../utils/constants";
import { Link, useNavigate } from 'react-router-dom';

import DatePicker from "react-multi-date-picker"
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
  const [values, setValues] = useState(INITIAL_FILTER_DATE)

  const [fromDate, endDate] = values
  const fromDateObj = new Date(fromDate?.toString())
  const endDateObj = new Date(endDate?.toString())
  const handouts = allHandouts.filter(item => {
    return new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj
  })
  const handoutsSummary = getHandoutSummary(handouts, fromDateObj, endDateObj)

  const { total, givenToCustomer, profit } = handoutsSummary;

  const headCell = ["name", "mobile", "nominee", "amount", "date", "address"]

  const handleClick = (item: Handout) => {
    navigate(`${SCREENS.HANDOUTS}/${item.id}`)
  }

  return (
    <div className="handouts-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1>Handouts Management</h1>
      <div className="form-section">
        <h2>Add New Handout</h2>
        <FormDataComp />
      </div>

      <div className="table-section">
        <div className="header-section" >
          <span className="title" >Handouts Records</span>
          <DatePicker
            format={DATE_PICKER_FORMAT}
            value={values}
            onChange={setValues}
            range
            dateSeparator="  To  "
          />
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