import type { collection } from '../utils/interface';
import { STATUS_TYPES, collectionPageIgnoreField, initialFormData } from '../utils/constants';

import React from 'react'
import { addCollection } from '../store/collectionSlice';
import { addHandout, edithandout } from '../store/handoutsSlice';
import { showSnackBar, type formDetailsType } from '../store/AppConfigReducer';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isNonEmpty } from '../utils/utilsFunction';

interface formDateHookProps {
  isCollectionPage?: boolean
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
    handoutId: false,
  });

  const newHandout = {
    id: isNonEmpty(formData.handoutId) ? formData.handoutId : uuidv4(),
    name: formData.name.trim(),
    mobile: formData.mobile.trim(),
    nominee: formData.nominee.trim(),
    amount: Number(formData.amount),
    date: formData.date,
    address: formData.address.trim(),
    collection: [] as collection[],
    status: STATUS_TYPES.ACTIVE
  };

  const newCollection = {
    id: uuidv4(),
    name: formData.name.trim(),
    amount: Number(formData.amount),
    date: formData.date,
    handoutId: formData.handoutId,
  } as collection

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
      handoutId: Boolean(isCollectionPage) && formData.handoutId.trim() === ''
    };
    for (const key in newErrors) {
      if (isCollectionPage && collectionPageIgnoreField.includes(key))
        newErrors[key as keyof typeof newErrors] = false;
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleShowMsg = (msg: string) => {
    dispatch(showSnackBar({
      message: msg,
      status: "success"
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {

      if (isCollectionPage) {
        handleShowMsg("Collection added successfully");
        dispatch(addCollection(newCollection));
      }
      else {
        if (isNonEmpty(formData.handoutId)) {
          dispatch(edithandout(newHandout));
          handleShowMsg("Handout updated successfully");
        }
        else {
          handleShowMsg("Handout added successfully");
          dispatch(addHandout(newHandout));
        }
      }
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

  const handleEdit = (item: formDetailsType) => {
    setFormData(Object.assign({}, initialFormData, item))
  }


  return {
    handleSubmit, formData, errors, handleChange, handleEdit
  }
}

export default useFormDataHooks