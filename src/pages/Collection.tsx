import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE } from '../utils/constants';

import DatePicker from 'react-multi-date-picker';
import FormDataComp from './FormDataComp';
import { Link } from 'react-router-dom';
import TableComponentV1 from '../common/TableComponent';
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
        <TableComponentV1 headCell={headCell} list={collectionList} />
        <div className="given-summary">
          <p>Total Collected: {total}</p>
        </div>
      </div>
    </div>
  );
}

export default Collection;