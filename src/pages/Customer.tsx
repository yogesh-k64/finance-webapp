import TableComponentV1 from "../common/TableComponent";
import DialogComponent from "../common/DialogComponent";
import FormDataComp, { type FormField } from "./FormDataComp";
import { customerInitialFormData } from "../utils/constants";
import { useRef, useState, useCallback, useMemo } from "react";
import type { HeadCell } from "../utils/interface";
import { UserClass } from "../responseClass/UserClass";
import { useSelector } from "react-redux";
import { useUserList } from "../store/customerSlice";
import { useIsMobile } from "../store/AppConfigReducer";
import { customerMobileHeadCell } from "../utils/mobileTableCells";
import useUserApi from "../hooks/useUserApi";
import { Button } from "@mui/material";

function Customers() {
  const [formData, setFormData] = useState(customerInitialFormData);
  const [openDialog, setOpenDialog] = useState(false);
  const userList = useSelector(useUserList);
  const isMobile = useSelector(useIsMobile);
  const { createUser, deleteUser, updateUser } = useUserApi();
  const editId = useRef<number>(null);

  const headCell: HeadCell[] = [
    { label: "id", renderValue: "getId" },
    { label: "name", renderValue: "getName" },
    { label: "address", renderValue: "getAddress" },
    { label: "info", renderValue: "getInfo" },
    { label: "mobile", renderValue: "getMobile" },
    { label: "createdAt", renderValue: "getCreatedAt" },
    { label: "updatedAt", renderValue: "getUpdatedAt" },
  ];

  const ERROR_MSG = {
    name: "Name is required",
    mobile: "Valid 10-digit number required",
    address: "Address is required",
    info: "Info is required",
    referredBy: "Referred by is required",
  };
  const handleSelectChange = useCallback((evt: any) => {
    const {
      target: { value, name },
    } = evt;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: "" },
    }));
  }, []);

  const userOptions = useMemo(() => {
    return userList.map((item) => ({
      value: String(item.getId()),
      label: item.getName(),
    }))}
  , [userList]);

  const formFields: FormField[] = useMemo(() => [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "text",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: false,
      multiline: true,
    },
    {
      name: "info",
      label: "Info",
      type: "text",
      required: false,
      multiline: true,
    },
    {
      name: "referredBy",
      label: "Referred By",
      type: "dropDown",
      required: false,
      options: userOptions,
      handleSelectChange: handleSelectChange,
      multiline: true,
    },
  ], [userOptions, handleSelectChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: "" },
    }));
  }, []);

  const validateForm = () => {
    const isNameNotValid = formData.name.value.trim() === "";
    const isMobileNotValid =
      formData.mobile.value.trim() === "" ||
      !/^\d{10}$/.test(formData.mobile.value);
    setFormData((prev) => {
      return {
        ...prev,
        name: {
          value: prev.name.value,
          errorMsg: isNameNotValid ? ERROR_MSG.name : "",
        },
        mobile: {
          value: prev.mobile.value,
          errorMsg: isMobileNotValid ? ERROR_MSG.mobile : "",
        },
      };
    });
    return !isMobileNotValid || !isNameNotValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newUser = new UserClass();
      newUser.setName(formData.name.value);
      newUser.setMobile(Number(formData.mobile.value));
      newUser.setAddress(formData.address.value);
      newUser.setInfo(formData.info.value);
      if (editId.current) {
        updateUser(editId.current, newUser);
      } else {
        createUser(newUser, formData.referredBy.value);
      }
      setFormData(customerInitialFormData);
      editId.current = null;
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(customerInitialFormData);
    editId.current = null;
  };

  return (
    <div className="handouts-container">
      <div className="table-section">
        <div className="table-header">
          <span className="title label-title">Customer Records</span>

          <Button
            variant="contained"
            className="action-btn"
            onClick={handleOpenDialog}
          >
            {isMobile ? "Add" : "Add New Customer"}
          </Button>
        </div>
        <TableComponentV1
          headCell={isMobile ? customerMobileHeadCell : headCell}
          list={userList}
          onDelete={(item: UserClass) => {
            deleteUser(item.getId());
          }}
          onEdit={(item: UserClass) => {
            editId.current = item.getId();
            setFormData((prev) => {
              return {
                ...prev,
                name: { value: item.getName(), errorMsg: "" },
                mobile: { value: String(item.getMobile()), errorMsg: "" },
                address: { value: item.getAddress(), errorMsg: "" },
                info: { value: item.getInfo(), errorMsg: "" },
                referredBy: { value: "", errorMsg: "" },
              };
            });
            setOpenDialog(true);
          }}
        />
      </div>

      <DialogComponent
        open={openDialog}
        onClose={handleCloseDialog}
        title={editId.current ? "Update Customer" : "Add New Customer"}
      >
        <FormDataComp
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formFields={formFields}
          buttonText={editId.current ? "Update Customer" : "Add Customer"}
        />
      </DialogComponent>
    </div>
  );
}

export default Customers;
