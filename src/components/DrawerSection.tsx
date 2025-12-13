import { useLocation, useNavigate } from "react-router-dom";

import { SCREENS } from "../utils/constants";
import JsonStorageControls from "../pages/ImportComp";

const DrawerSection = () => {
  const navigate = useNavigate();
  const locationInfo = useLocation();
  const { pathname } = locationInfo;

  const tabList = [
    { label: "Home", path: SCREENS.HOME },
    { label: "Handouts", path: SCREENS.HANDOUTS },
    { label: "Collection", path: SCREENS.COLLECTION },
    { label: "Customers", path: SCREENS.CUSTOMERS },
  ];

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
      <div className="sidebar-controls">
        <JsonStorageControls />
      </div>
    </div>
  );
};

export default DrawerSection;
