import { Button, TextField } from '@mui/material'

import useFormDataHooks from '../hooks/UseFormDataHooks'

const FormDataComp = () => {

  const { errors, formData, handleChange, handleSubmit } = useFormDataHooks()
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            helperText={errors.name ? 'Name is required' : ''}
            required
            className="form-group"
          />

          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            error={errors.mobile}
            helperText={errors.mobile ? 'Valid 10-digit number required' : ''}
            required
            className="form-group"
          />
        </div>

        <div className="form-row">
          <TextField
            fullWidth
            label="Nominee"
            name="nominee"
            value={formData.nominee}
            onChange={handleChange}
            error={errors.nominee}
            helperText={errors.nominee ? 'Nominee is required' : ''}
            className="form-group"
          />

          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            helperText={errors.amount ? 'Valid amount required' : ''}
            required
            className="form-group"
          />
        </div>

        <div className="form-row">
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={errors.date}
            helperText={errors.date ? 'Date is required' : ''}
            required
            className="form-group"
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            helperText={errors.address ? 'Address is required' : ''}
            multiline
            rows={2}
            className="form-group"
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          className="add-button"
        >
          Add Handout
        </Button>
      </form>
    </>
  )
}

export default FormDataComp