import TableComponentV1 from "../common/TableComponent";
import DialogComponent from "../common/DialogComponent";
import FormDataComp, { type FormField } from "./FormDataComp";
import {
  customerInitialFormData,
  linkUserInitialFormData,
} from "../utils/constants";
import { useRef, useState, useCallback, useMemo } from "react";
import type { HeadCell, MoreOption } from "../utils/interface";
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
  const [linkUserFormData, setLinkUserFormData] = useState(
    linkUserInitialFormData
  );
  const [openLinkUserDialog, setOpenLinkUserDialog] = useState(false);
  const userList = useSelector(useUserList);
  const isMobile = useSelector(useIsMobile);
  const { createUser, deleteUser, updateUser, linkUserReferral } = useUserApi();
  const editId = useRef<number>(null);
  const linkUserId = useRef<number>(null);

  const headCell: HeadCell[] = [
    { label: "id", renderValue: "getId" },
    { label: "name", renderValue: "getName" },
    { label: "address", renderValue: "getAddress" },
    { label: "info", renderValue: "getInfo" },
    { label: "mobile", renderValue: "getMobile" },
    { label: "updatedAt", renderValue: "getUpdatedAt" },
  ];

  const ERROR_MSG = {
    name: "Name is required",
    mobile: "Valid 10-digit number required",
    address: "Address is required",
    info: "Info is required",
  };

  const handleLinkUserSelectChange = useCallback((evt: any) => {
    const {
      target: { value, name },
    } = evt;
    setLinkUserFormData((prev) => ({
      ...prev,
      [name]: { value: value, errorMsg: "" },
    }));
  }, []);

  const userOptions = useMemo(() => {
    return userList.map((item) => ({
      value: String(item.getId()),
      label: item.getName(),
    }));
  }, [userList]);

  const formFields: FormField[] = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        className: "form-group",
      },
      {
        name: "mobile",
        label: "Mobile",
        type: "text",
        required: true,
        className: "form-group",
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        required: false,
        multiline: true,
        className: "form-group-full",
      },
      {
        name: "info",
        label: "Info",
        type: "text",
        required: false,
        multiline: true,
        className: "form-group-full",
      },
    ],
    []
  );

  const linkUserFormFields: FormField[] = useMemo(
    () => [
      {
        name: "referredBy",
        label: "Referred By",
        type: "dropDown",
        required: true,
        options: userOptions,
        handleSelectChange: handleLinkUserSelectChange,
        className: "form-group-full",
      },
    ],
    [userOptions, handleLinkUserSelectChange]
  );

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
        createUser(newUser);
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

  const handleLinkUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUserFormData.referredBy.value) {
      setLinkUserFormData((prev) => ({
        ...prev,
        referredBy: {
          value: prev.referredBy.value,
          errorMsg: "Referred by is required",
        },
      }));
      return;
    }
    if (linkUserId.current) {
      linkUserReferral(linkUserId.current, {
        referredBy: Number(linkUserFormData.referredBy.value),
      });
      setLinkUserFormData(linkUserInitialFormData);
      linkUserId.current = null;
      setOpenLinkUserDialog(false);
    }
  };

  const handleOpenLinkUserDialog = (item: UserClass) => {
    linkUserId.current = item.getId();
    setOpenLinkUserDialog(true);
  };

  const handleCloseLinkUserDialog = () => {
    setOpenLinkUserDialog(false);
    setLinkUserFormData(linkUserInitialFormData);
    linkUserId.current = null;
  };

  const moreOptions: MoreOption[] = [
    {
      label: "Link Nominee",
      onClick: (rowItem: UserClass) => {
        handleOpenLinkUserDialog(rowItem);
      },
    },
  ];

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
              };
            });
            setOpenDialog(true);
          }}
          moreOptions={moreOptions}
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

      <DialogComponent
        maxWidth="sm"
        open={openLinkUserDialog}
        onClose={handleCloseLinkUserDialog}
        title="Link User Referral"
      >
        <FormDataComp
          formData={linkUserFormData}
          handleChange={() => {}}
          handleSubmit={handleLinkUserSubmit}
          formFields={linkUserFormFields}
          buttonText="Link User"
        />
      </DialogComponent>
    </div>
  );
}

export default Customers;
