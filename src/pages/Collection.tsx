import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import type { HeadCell, collection } from '../utils/interface';
import { removeCollection, useCollectionList } from '../store/collectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addCollection } from '../store/collectionSlice';
import { showSnackBar } from '../store/AppConfigReducer';
import { v4 as uuidv4 } from 'uuid';

import FormDataComp from './FormDataComp';
import { HEAD_CELL_ACTION, initialFormData } from '../utils/constants';
import TableComponentV1 from '../common/TableComponent';
import { getCollectionSummary } from '../utils/utilsFunction';
import { useHomeDateRange } from '../store/AppConfigReducer';
import { useState } from 'react';

function Collection() {

  const allCollectionList = useSelector(useCollectionList);
  const dispatch = useDispatch();
  
  const allFormFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      errorMsg: 'Name is required',
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
      name: 'handoutId',
      label: 'HandoutId',
      type: 'text',
      required: true,
      errorMsg: 'HandoutId is required',
    },
  ];
  
  const formFields = allFormFields; 
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      mobile: false, // Not used in collection
      nominee: false, // Not used in collection
      amount: formData.amount.trim() === '' || isNaN(Number(formData.amount)),
      date: formData.date.trim() === '',
      address: false, // Not used in collection
      handoutId: formData.handoutId.trim() === '' // Required for collection
    };
    
    return !Object.values(newErrors).some(error => error);
  };

  // Form submission logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newCollection = {
        id: uuidv4(),
        name: formData.name.trim(),
        amount: Number(formData.amount),
        date: formData.date,
        handoutId: formData.handoutId,
      } as collection;

      dispatch(showSnackBar({ message: "Collection added successfully", status: "success" }));
      dispatch(addCollection(newCollection));
      
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
  const headCell: HeadCell[] = [
    { label: "name" },
    { label: "amount" },
    { label: "date" },
    { label: "handoutId" },
    {
      label: HEAD_CELL_ACTION,
      onDelete: (item: collection) => {
        dispatch(removeCollection(item.id));
      }
    }
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
        <FormDataComp 
          formData={formData as any}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formFields={formFields}
          buttonText="Add Collection"
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