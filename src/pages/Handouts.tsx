import DatePicker, { DateObject } from "react-multi-date-picker"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { DATE_PICKER_FORMAT } from "../utils/constants";
import FormDataComp from './FormDataComp';
import { Link } from 'react-router-dom';
import { getHandoutSummary } from "../utils/utilsFunction";
import { useHandoutsList } from '../store/handoutsSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Handouts() {
  const allHandouts = useSelector(useHandoutsList);
  const [values, setValues] = useState([
    new DateObject().subtract(7, "days"),
    new DateObject().add(1, "days")
  ])
  
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
        {handouts.length > 0 ? (
          <TableContainer component={Paper} className="handouts-table">
            <Table>
              <TableHead>
                <TableRow>
                  {headCell.map(item => <TableCell>{item}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {handouts.map(handout => (
                  <TableRow key={handout.id}>
                    {headCell.map(item => <TableCell>{handout[item as keyof typeof handout] || "-"}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No handouts records found.</p>
        )}

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