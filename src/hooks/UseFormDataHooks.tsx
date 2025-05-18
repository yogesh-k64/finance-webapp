import type { Handout, collection } from '../utils/interface';

import React from 'react'
import { addCollection } from '../store/collectionSlice';
import { addHandout } from '../store/handoutsSlice';
import { collectionPageIgnoreField } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface formDateHookProps {
  isCollectionPage?: boolean
}

const initialFormData = {
    name: '',
    mobile: '',
    nominee: '',
    amount: '',
    date: '',
    address: '',
  }

const useFormDataHooks = (props: formDateHookProps) => {
  const { isCollectionPage } = props
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialFormData);

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
    for (const key in newErrors) {
      if (isCollectionPage && collectionPageIgnoreField.includes(key))
        newErrors[key as keyof typeof newErrors] = false;
    }
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

      const newCollection = {
        id: uuidv4(),
        name: formData.name.trim(),
        amount: Number(formData.amount),
        date: formData.date,
        handoutId: ''
      } as collection

      if (isCollectionPage)
        dispatch(addCollection(newCollection));
      else
        dispatch(addHandout(newHandout));
      setFormData({
        name: '',
        mobile: '',
        nominee: '',
        amount: '',
        date: formData.date,
        address: '',
      });
    }
  };

  const handleEdit =(item: collection | Handout)=>{
    setFormData(Object.assign({}, initialFormData, item))
  }


  return {
    handleSubmit, formData, errors, handleChange, handleEdit
  }
}

export default useFormDataHooks