import { Checkbox, FormControlLabel } from '@mui/material';
import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE } from '../utils/constants';

import DatePicker from 'react-multi-date-picker';
import FormDataComp from './FormDataComp';
import { Link } from 'react-router-dom';
import TableComponentV1 from '../common/TableComponent';
import type { collection } from '../utils/interface';
import { getCollectionSummary } from '../utils/utilsFunction';
import { useCollectionList } from '../store/collectionSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Collection() {

  const allCollectionList = useSelector(useCollectionList);
  const headCell = ["name", "amount", "date", "handoutId"]

  const [values, setValues] = useState(INITIAL_FILTER_DATE)
  const [checked, setChecked] = useState<boolean>(false);

  const [fromDate, endDate] = values
  const fromDateObj = new Date(fromDate?.toString())
  const endDateObj = new Date(endDate?.toString())

  const collectionList = allCollectionList.reduce((acc, item) => {
    if (checked)
      acc.push(item)
    else if (fromDateObj && endDateObj && new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj) {
      acc.push(item)
    }
    return acc
  }, [] as collection[])
  const { total } = getCollectionSummary(collectionList, fromDateObj, endDateObj);

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1 className='title' >Collection Management</h1>
      </div>
      <div className="form-section">
        <h2>Add New Collection</h2>
        <FormDataComp />
      </div>

      <div className="table-section">
        <div className="header-section" >
          <span className="title" >Collection Records</span>
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
        <TableComponentV1 headCell={headCell} list={collectionList} />
        <div className="given-summary">
          <p>Total Collected: {total}</p>
        </div>
      </div>
    </div>
  );
}

export default Collection;