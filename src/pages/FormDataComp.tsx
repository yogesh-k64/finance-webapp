import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import { isNonEmpty } from '../utils/utilsFunction';
import { memo } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  InputLabelProps?: { shrink: boolean };
  multiline?: boolean;
  options?: Array<{ value: string; label: string }>;
  handleSelectChange?: (e: any) => void;
  className?: string;
}

interface FormDataCompProps {
  formData: Record<string, { value: string; errorMsg: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  formFields: FormField[];
  buttonText: string;
}

const FormDataComp: React.FC<FormDataCompProps> = memo(({ formData, handleChange, handleSubmit, formFields, buttonText }) => {
  return (
    <>
      <form onSubmit={handleSubmit} className='form-container' >
        {formFields.map((field) => {
          const formFieldItem = formData[field.name]
          const isError = isNonEmpty(formFieldItem?.errorMsg)
          const fieldClassName = `form-group ${field.className ? field.className : ''}`
          
          if (field.type === 'dropDown') {
            return (
              <FormControl 
                key={field.name} 
                fullWidth 
                error={isError}
                required={field.required}
                className={fieldClassName}
              >
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formFieldItem?.value || ''}
                  onChange={field.handleSelectChange}
                  label={field.label}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {isNonEmpty(formFieldItem.errorMsg) && (
                  <FormHelperText>{formFieldItem?.errorMsg}</FormHelperText>
                )}
              </FormControl>
            );
          }

          return <TextField
            key={field.name}
            fullWidth={true}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formFieldItem?.value || ''}
            onChange={handleChange}
            error={isError}
            helperText={formFieldItem.errorMsg ? formFieldItem?.errorMsg : ''}
            required={field.required}
            className={fieldClassName}
            InputLabelProps={field.InputLabelProps}
            multiline={field.multiline}
            variant="outlined"
          />
        })}
        <div>
          <Button
            type="submit"
            variant="contained"
            className="add-button"
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </>
  )
})

FormDataComp.displayName = 'FormDataComp';

export default FormDataComp