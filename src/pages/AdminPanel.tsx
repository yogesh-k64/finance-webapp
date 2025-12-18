import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useIsMobile } from '../store/AppConfigReducer';
import useAdminApi from '../hooks/useAdminApi';
import { Button } from '@mui/material';
import TableComponentV1 from '../common/TableComponent';
import DialogComponent from '../common/DialogComponent';
import FormDataComp, { type FormField } from './FormDataComp';
import { adminUserHeadCell } from '../utils/tableHeadCells';
import { adminUserMobileHeadCell } from '../utils/mobileTableCells';
import DotLoader from '../common/DotLoader';
import { AdminUserClass } from '../responseClass/AdminUserClass';
import { USER_ROLES } from '../utils/constants';

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    username: { value: '', errorMsg: '' },
    password: { value: '', errorMsg: '' },
    role: { value: 'viewer', errorMsg: '' },
    active: { value: 'true', errorMsg: '' },
  });
  const [openDialog, setOpenDialog] = useState(false);
  const editId = useRef<number | null>(null);

  const isMobile = useSelector(useIsMobile);
  const { loading, users, getUsers, createUser, updateUser, deleteUser } = useAdminApi();

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = useCallback((evt: any) => {
    const { target: { value, name } } = evt;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: '' },
    }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: type === 'checkbox' ? String(checked) : value, errorMsg: '' },
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId.current) {
      // Update existing user
      const updateData: any = {};
      if (formData.password.value) updateData.password = formData.password.value;
      if (formData.role.value) updateData.role = formData.role.value;
      if (formData.active.value !== undefined) updateData.active = formData.active.value === 'true';

      updateUser(editId.current, updateData);
      handleCloseDialog();
    } else {
      // Create new user
      const userData = {
        username: formData.username.value,
        password: formData.password.value,
        role: formData.role.value,
      };

      createUser(userData);
      handleCloseDialog();
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    editId.current = null;
    setFormData({
      username: { value: '', errorMsg: '' },
      password: { value: '', errorMsg: '' },
      role: { value: 'viewer', errorMsg: '' },
      active: { value: 'true', errorMsg: '' },
    });
  };

  const handleEditClick = (user: AdminUserClass) => {
    editId.current = user.getId();
    setFormData({
      username: { value: user.getUsername(), errorMsg: '' },
      password: { value: '', errorMsg: '' },
      role: { value: user.getRole(), errorMsg: '' },
      active: { value: String(user.getActive()), errorMsg: '' },
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = (user: AdminUserClass) => {
    deleteUser(user.getId());
  };

  const roleOptions = useMemo(() => [
    { value: USER_ROLES.Admin, label: 'Admin' },
    { value: USER_ROLES.Manager, label: 'Manager' },
    { value: USER_ROLES.Viewer, label: 'Viewer' },
  ], []);

  const isEditing = editId.current !== null;
  
  const formFields: FormField[] = useMemo(() => [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      className: 'form-group',
    },
    {
      name: 'password',
      label: isEditing ? 'Password (leave empty to keep current)' : 'Password',
      type: 'password',
      required: !isEditing,
      className: 'form-group',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'dropDown',
      required: true,
      options: roleOptions,
      handleSelectChange: handleSelectChange,
      className: 'form-group',
    },
    ...(isEditing ? [{
      name: 'active',
      label: 'Active',
      type: 'checkbox',
      required: false,
      className: 'form-group-full',
    }] : []),
  ], [isEditing, roleOptions, handleSelectChange]);

  return (
    <div className="handouts-container admin-panel-page">
      <div className="table-section">
        <div className="table-header">
          <span className="title label-title">
            User Management
            {loading && <DotLoader />}
          </span>

          <Button
            variant="contained"
            className="action-btn"
            onClick={handleOpenDialog}
          >
            {isMobile ? 'Add User' : 'Add New User'}
          </Button>
        </div>
        <TableComponentV1
          headCell={isMobile ? adminUserMobileHeadCell : adminUserHeadCell}
          list={users}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteUser}
        />
      </div>

      <DialogComponent
        open={openDialog}
        onClose={handleCloseDialog}
        title={isEditing ? 'Update User' : 'Add New User'}
      >
        <FormDataComp
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formFields={formFields}
          buttonText={isEditing ? 'Update User' : 'Add User'}
        />
      </DialogComponent>
    </div>
  );
};

export default AdminPanel;
