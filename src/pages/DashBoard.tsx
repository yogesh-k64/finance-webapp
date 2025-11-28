import { DATE_PICKER_FORMAT, SCREENS } from "../utils/constants";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { Outlet, useLocation } from "react-router-dom";
import { formatDateRange, isNonEmpty } from "../utils/utilsFunction";
import {
  storeHomePageDateRange,
  useHomeDateRange,
} from "../store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DrawerSection from "../components/DrawerSection";
import { Grid } from "@mui/material";
import JsonStorageControls from "./ImportComp";
import PeopleOutlineSharpIcon from "@mui/icons-material/PeopleOutlineSharp";
import { useEffect, useState } from "react";
import { storeRefreshUser, useRefreshUsers } from "../store/RefreshReducer";
import useUserApi from "../hooks/useUserApi";

const DashBoard = () => {
  const homeDateRange = useSelector(useHomeDateRange);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [openSideBar, setOpenSideBar] = useState(true);
  const refreshUser = useSelector(useRefreshUsers);
  const { getUsers } = useUserApi();
  const updateDateRange = (dateRange: DateObject[]) => {
    dispatch(storeHomePageDateRange(dateRange));
  };

  const title = {
    [SCREENS.HANDOUTS]: {
      title: "Handouts Management",
      icon: <DescriptionRoundedIcon />,
    },
    [SCREENS.COLLECTION]: {
      title: "Collection Management",
      icon: <AccountBalanceWalletRoundedIcon />,
    },
    [SCREENS.CUSTOMERS]: {
      title: "Customer Management",
      icon: <PeopleOutlineSharpIcon />,
    },
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (refreshUser) {
      getUsers();
      dispatch(storeRefreshUser(false));
    }
  }, [refreshUser]);

  return (
    <Grid container className="main-container">
      <Grid size={openSideBar ? 2 : 12} p={3} className={`drawer-section`}>
        <DrawerSection
          isDrawerOpen={openSideBar}
          setOpenSideBar={setOpenSideBar}
        />
      </Grid>
      <Grid
        size={openSideBar ? 10 : 12}
        p={3}
        className={`content-section ${openSideBar ? "" : "closed"}`}
      >
        <div className="header">
          <div
            className={`heading ${isNonEmpty(title[pathname]) ? "" : "hideVisible"}`}
          >
            {title[pathname]?.icon}
            <span>{title[pathname]?.title}</span>
          </div>
          <div className="range-selection">
            <JsonStorageControls />
            <DatePicker
              format={DATE_PICKER_FORMAT}
              value={homeDateRange}
              onChange={updateDateRange}
              range
              render={(value: string, openCalendar: () => void) => {
                return (
                  <button
                    onClick={openCalendar}
                    className="custom-datepicker-input"
                  >
                    {formatDateRange(value)}
                  </button>
                );
              }}
            />
          </div>
        </div>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default DashBoard;
