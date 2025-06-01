import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { HEAD_CELL_ACTION, SCREENS } from "../utils/constants";
import type { Handout, HeadCell } from "../utils/interface";
import { removeHandout, useHandoutsList } from '../store/handoutsSlice';
import { storeFormDetails, useHomeDateRange } from "../store/AppConfigReducer";
import { useDispatch, useSelector } from 'react-redux';

import FormDataComp from './FormDataComp';
import TableComponentV1 from "../common/TableComponent";
import { getHandoutSummary } from "../utils/utilsFunction";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Handouts() {
  const navigate = useNavigate();
  const allHandouts = useSelector(useHandoutsList);
  const values = useSelector(useHomeDateRange)
  const dispatch = useDispatch();
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

  const headCell: HeadCell[] = [
    { label: "name" },
    { label: "mobile" },
    { label: "nominee" },
    { label: "amount" },
    { label: "date" },
    { label: "id" },
    { label: "address" },
    {
      label: HEAD_CELL_ACTION,
      onDelete: (item: Handout) => {
        dispatch(removeHandout(item.id));
      },
      onEdit: (item: Handout) => {
        dispatch(storeFormDetails({
          name: item.name,
          mobile: item.mobile,
          nominee: item.nominee,
          amount: item.amount.toString(),
          date: item.date,
          address: item.address,
          handoutId: item.id
        }));
      }
    }]

  const handleClick = (item: Handout) => {
    navigate(`${SCREENS.HANDOUTS}/${item.id}`)
  }

  const handleShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const summaryList = [
    { title: "Total Amount", value: total },
    { title: "Handout Amount", value: givenToCustomer },
    { title: "Profit", value: profit }
  ]

  return (
    <div className="handouts-container">
      <div className="form-section">
        <h2>Add New Handout</h2>
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
          <span className="title label-title" >Handouts Records</span>
          <div className="show-all-checkbox">
            <FormControlLabel control={<Checkbox checked={checked} onChange={handleShowAll} />}
              label="Show All" />
          </div>
        </div>
        <TableComponentV1 headCell={headCell} list={handouts} onClick={handleClick} />

      </div>
    </div>
  );
}

export default Handouts;