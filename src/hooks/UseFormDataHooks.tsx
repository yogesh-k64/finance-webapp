import React from 'react'
import { addHandout } from '../store/handoutsSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useFormDataHooks = () => {

  const dispatch = useDispatch();

const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    nominee: '',
    amount: '',
    date: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    mobile: false,
    nominee: false,
    amount: false,
    date: false,
    address: false,
  });

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      mobile: formData.mobile.trim() === '' || !/^\d{10}$/.test(formData.mobile),
      nominee: false,
      amount: formData.amount.trim() === '' || isNaN(Number(formData.amount)),
      date: formData.date.trim() === '',
      address: false,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newHandout = {
        id: uuidv4(),
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        nominee: formData.nominee.trim(),
        amount: Number(formData.amount),
        date: formData.date,
        address: formData.address.trim(),
      };
      dispatch(addHandout(newHandout));
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        nominee: '',
        amount: '',
        date: '',
        address: '',
      });
    }
  };

  
  return {
handleSubmit, formData, errors, handleChange
  }
}

export default useFormDataHooks