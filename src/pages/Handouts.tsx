import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { HEAD_CELL_ACTION, SCREENS, initialFormData } from "../utils/constants";
import type { Handout, HeadCell } from "../utils/interface";
import { useHandoutsList } from '../store/handoutsSlice';
import { useHomeDateRange, showSnackBar } from "../store/AppConfigReducer";
import { useDispatch, useSelector } from 'react-redux';
import { isNonEmpty } from '../utils/utilsFunction';

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

  // Form fields configuration (filter out handout-specific ignored fields)
  const allFormFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      errorMsg: 'Name is required',
    },
    {
      name: 'mobile',
      label: 'Mobile',
      type: 'text',
      required: true,
      errorMsg: 'Valid 10-digit number required',
    },
    {
      name: 'nominee',
      label: 'Nominee',
      type: 'text',
      required: false,
      errorMsg: 'Nominee is required',
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      errorMsg: 'Valid amount required',
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      errorMsg: 'Date is required',
      InputLabelProps: { shrink: true }
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: false,
      errorMsg: 'Address is required',
      multiline: true,
    },
  ];
  
  const formFields = allFormFields; // Handouts uses all fields except handoutId

  // Form state management for this component
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      mobile: formData.mobile.trim() === '' || !/^\d{10}$/.test(formData.mobile),
      nominee: false,
      amount: formData.amount.trim() === '' || isNaN(Number(formData.amount)),
      date: formData.date.trim() === '',
      address: false,
      handoutId: false // Handouts page doesn't require handoutId
    };
    return !Object.values(newErrors).some(error => error);
  };

  // Form submission logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      

      if (isNonEmpty(formData.handoutId)) {
        dispatch(showSnackBar({ message: "Handout updated successfully", status: "success" }));
      } else {
        dispatch(showSnackBar({ message: "Handout added successfully", status: "success" }));
      }
      
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        nominee: '',
        amount: '',
        date: formData.date,
        address: '',
        handoutId: ''
      });
    }
  };

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
      console.log('item delete:', item);
        // dispatch(removeHandout(item.id));
      },
      onEdit: (item: Handout) => {
      console.log('item edit :', item);

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
        <FormDataComp 
          formData={formData as any}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formFields={formFields}
          buttonText="Add Handout"
        />
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