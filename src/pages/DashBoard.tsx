import { MAX_MOBILE_WIDTH, SCREENS } from "../utils/constants";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setIsMobile, storeLoader, useIsMobile } from "../store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DrawerSection from "../components/DrawerSection";
import GlobalLoader from "../common/GlobalLoader";
import { Grid, BottomNavigation, BottomNavigationAction } from "@mui/material";
import PeopleOutlineSharpIcon from "@mui/icons-material/PeopleOutlineSharp";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useEffect } from "react";
import {
  storeRefreshCollections,
  storeRefreshHandouts,
  storeRefreshUser,
  useRefreshCollections,
  useRefreshHandouts,
  useRefreshUsers,
} from "../store/RefreshReducer";
import useUserApi from "../hooks/useUserApi";
import useHandoutApi from "../hooks/useHandoutApi";
import useCollectionApi from "../hooks/useCollectionApi";

const DashBoard = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const refreshUser = useSelector(useRefreshUsers);
  const refreshHandouts = useSelector(useRefreshHandouts);
  const refreshCollections = useSelector(useRefreshCollections);
  const isMobile = useSelector(useIsMobile);
  const { getUsers, loading : userLoading } = useUserApi();
  const { getHandouts, loading : handoutLoading } = useHandoutApi();
  const { getCollections, loading : collectionLoading } = useCollectionApi();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth <= MAX_MOBILE_WIDTH));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    getUsers();
    getHandouts();
    getCollections();
  }, []);

  useEffect(() => {
    if (refreshUser) {
      getUsers();
      dispatch(storeRefreshUser(false));
    }
  }, [refreshUser]);

  useEffect(() => {
    if (refreshHandouts) {
      getHandouts();
      dispatch(storeRefreshHandouts(false));
    }
  }, [refreshHandouts]);

  useEffect(() => {
    if (refreshCollections) {
      getCollections();
      dispatch(storeRefreshCollections(false));
    }
  }, [refreshCollections]);

  useEffect(() => {
    const isLoading = userLoading || handoutLoading || collectionLoading;
    dispatch(storeLoader(isLoading));
  }, [userLoading, handoutLoading, collectionLoading, dispatch]);

  return (
    <>
      <GlobalLoader />
      <Grid container className="main-container">
        <Grid size={{ xs: 0, md: 2 }} p={3} className="drawer-section">
          <DrawerSection />
        </Grid>
        <Grid
          size={{ xs: 12, md: 10 }}
          p={{ xs: 1, md: 3 }}
          className="content-section"
        >
          <Outlet />
        </Grid>
      </Grid>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation
          value={pathname}
          onChange={(_event, newValue) => {
            navigate(newValue);
          }}
          className="mobile-bottom-nav"
          showLabels={false}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            backgroundColor: "#0B1739",
            borderTop: "0.6px solid #343B4F",
            boxShadow: "0px -4px 12px 0px rgba(1, 5, 17, 0.3)",
            zIndex: 1000,
            "& .MuiBottomNavigationAction-root": {
              color: "#AEB9E1",
              minWidth: "auto",
              "&.Mui-selected": {
                color: "#CB3CFF",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "24px",
              },
            },
          }}
        >
          <BottomNavigationAction
            value={SCREENS.HOME}
            icon={<HomeRoundedIcon />}
          />
          <BottomNavigationAction
            value={SCREENS.HANDOUTS}
            icon={<DescriptionRoundedIcon />}
          />
          <BottomNavigationAction
            value={SCREENS.COLLECTION}
            icon={<AccountBalanceWalletRoundedIcon />}
          />
          <BottomNavigationAction
            value={SCREENS.CUSTOMERS}
            icon={<PeopleOutlineSharpIcon />}
          />
        </BottomNavigation>
      )}
    </>
  );
};

export default DashBoard;
