import { Button, TextField } from '@mui/material'
import { SCREENS, collectionPageIgnoreField, handoutsIgnoreField } from '../utils/constants'

import useFormDataHooks from '../hooks/UseFormDataHooks'
import { useLocation } from 'react-router-dom'

const FormDataComp = () => {

  const locationInfo = useLocation()
  const isCollectionPage = locationInfo.pathname === SCREENS.COLLECTION
  const isHandoutsPage = locationInfo.pathname === SCREENS.HANDOUTS
  const { errors, formData, handleChange, handleSubmit } = useFormDataHooks({ isCollectionPage })

  const formFields = [
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
    {
      name: 'handoutId',
      label: 'HandoutId',
      type: 'text',
      required: true,
      errorMsg: 'Name is required',
    },
  ];


  return (
    <>
      <form onSubmit={handleSubmit} className='form-container' >
        {formFields.map((field) => {
          if (isCollectionPage && collectionPageIgnoreField.some(item => item === field.name))
            return <></>
          if (isHandoutsPage && handoutsIgnoreField.some(item => item === field.name))
            return <></>
          
          return <TextField
            key={field.name}
            fullWidth={true}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            error={errors[field.name as keyof typeof formData]}
            helperText={errors[field.name as keyof typeof formData] ? field.errorMsg : ''}
            required={field.required}
            className={`form-group`}
            InputLabelProps={field.InputLabelProps}
            multiline={field.multiline}
          />
        })}
        <div>
          <Button
            type="submit"
            variant="contained"
            className="add-button"
          >
            {isCollectionPage ? "Add Collection" : "Add Handout"}
          </Button>
        </div>
      </form>
    </>
  )
}

export default FormDataComp