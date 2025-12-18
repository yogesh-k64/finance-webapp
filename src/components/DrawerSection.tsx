import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import type { RootState } from "../store/store";
import { SCREENS } from "../utils/constants";
import JsonStorageControls from "../pages/ImportComp";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const DrawerSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationInfo = useLocation();
  const { pathname } = locationInfo;
  const admin = useSelector((state: RootState) => state.auth.admin);

  const tabList = [
    { label: "Home", path: SCREENS.HOME },
    { label: "Handouts", path: SCREENS.HANDOUTS },
    { label: "Collection", path: SCREENS.COLLECTION },
    { label: "Customers", path: SCREENS.CUSTOMERS },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate(SCREENS.LOGIN);
  };

  const toScreens = (path: string) => {
    navigate(path);
  };

  return (
    <div className="desktop-sidebar">
      <div className="title section-title">
        <span className="pointer" onClick={() => toScreens(SCREENS.HOME)}>
          Finance Manager
        </span>
      </div>
      {tabList.map((item) => {
        return (
          <div
            key={item.path}
            className={`page-label pointer ${pathname === item.path ? "active" : ""}`}
            onClick={() => toScreens(item.path)}
          >
            <span>{item.label}</span>
          </div>
        );
      })}
      {admin?.role === "admin" && (
        <div
          className={`page-label pointer ${pathname === SCREENS.ADMIN ? "active" : ""}`}
          onClick={() => toScreens(SCREENS.ADMIN)}
        >
          <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20 }} />
          <span>Admin Panel</span>
        </div>
      )}
      <div className="sidebar-controls">
        <JsonStorageControls />
      </div>
      <div style={{ marginTop: "auto", padding: "20px 0" }}>
        {admin && (
          <div style={{ marginBottom: "10px", color: "#AEB9E1", fontSize: "14px" }}>
            {admin.username} ({admin.role})
          </div>
        )}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DrawerSection;
