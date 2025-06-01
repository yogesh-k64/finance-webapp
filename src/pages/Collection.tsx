import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import type { HeadCell, collection } from '../utils/interface';

import FormDataComp from './FormDataComp';
import TableComponentV1 from '../common/TableComponent';
import { getCollectionSummary } from '../utils/utilsFunction';
import { useCollectionList } from '../store/collectionSlice';
import { useHomeDateRange } from '../store/AppConfigReducer';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Collection() {

  const allCollectionList = useSelector(useCollectionList);
  const headCell: HeadCell[] = [
    { label: "name" },
    { label: "amount" },
    { label: "date" },
    { label: "handoutId" },
  ]
  const values = useSelector(useHomeDateRange)

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

  const summaryList = [
    { title: "Collected Amount", value: total }
  ]

  return (
    <div className='handouts-container' >
      <div className="form-section">
        <h2>Add New Collection</h2>
        <FormDataComp />
      </div>
      <Grid container justifyContent={"space-between"} >
        {summaryList.map(item => {
          return <Grid size={3} key={item.title}
            className="summay-item" >
            <div className='item-box'>
              <div className='title' >{item.title}</div>
              <div className='value' >{item.value}</div>
            </div>
          </Grid>
        })}
      </Grid>
      <div className="table-section">
        <div className="header-section" >
          <span className="title" >Collection Records</span>
          <div className="show-all-checkbox" >
            <FormControlLabel control={<Checkbox checked={checked} onChange={handleShowAll} />}
              label="Show All" />
          </div>
        </div>
        <TableComponentV1 headCell={headCell} list={collectionList} />
      </div>
    </div>
  );
}

export default Collection;