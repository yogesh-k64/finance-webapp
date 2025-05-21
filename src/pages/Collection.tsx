import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE } from '../utils/constants';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import DatePicker from 'react-multi-date-picker';
import FormDataComp from './FormDataComp';
import { Link } from 'react-router-dom';
import { getCollectionSummary } from '../utils/utilsFunction';
import { useCollectionList } from '../store/collectionSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Collection() {

  const allCollectionList = useSelector(useCollectionList);
  const headCell = ["name", "amount", "date", "handoutId"]

  const [values, setValues] = useState(INITIAL_FILTER_DATE)

  const [fromDate, endDate] = values
  const fromDateObj = new Date(fromDate?.toString())
  const endDateObj = new Date(endDate?.toString())
  const collectionList = allCollectionList.filter(item => {
    return new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj
  })
  const { total } = getCollectionSummary(collectionList, fromDateObj, endDateObj);

  return (
    <div>
      <h1>Collection Page</h1>
      <Link to="/">Back to HomePage</Link>
      <div className="form-section">
        <h2>Add New Collection</h2>
        <FormDataComp />
      </div>

      <div className="table-section">
        <div className="header-section" >
          <span className="title" >Collection Records</span>
          <DatePicker
            format={DATE_PICKER_FORMAT}
            value={values}
            onChange={setValues}
            range
            dateSeparator="  To  "
          />
        </div>
        {collectionList.length > 0 ? (
          <TableContainer component={Paper} className="collectionList-table">
            <Table>
              <TableHead>
                <TableRow>
                  {headCell.map(item => <TableCell>{item}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {collectionList.map(handout => (
                  <TableRow key={handout.id}>
                    {headCell.map(item => <TableCell>{handout[item as keyof typeof handout] || "-"}</TableCell>)}
                  </TableRow>
                ))}
                {/* <TableCell>
                <IconButton onClick={() => handleEdit(item)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell> */}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No collection records found.</p>
        )}

        <div className="given-summary">
          <p>Total Collected: {total}</p>
        </div>
      </div>
    </div>
  );
}

export default Collection;