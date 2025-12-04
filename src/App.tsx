import "./styles/app.scss";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

import Collection from "./pages/Collection";
import Customers from "./pages/Customer";
import Dashboard from "./pages/DashBoard";
import Handouts from "./pages/Handouts";
import HandoutsDetails from "./pages/HandoutsDetails";
import UserDetails from "./pages/UserDetails";
import HomePage from "./pages/HomePage";
import { Provider } from "react-redux";
import { SCREENS } from "./utils/constants";
import SnackBar from "./common/Snackbar";
import { store } from "./store/store";
import { useEffect } from "react";

const customTheme = createTheme({
  typography: {
    fontFamily: "Nunito, sans-serif",
  },
});

function RouteRestorer() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we need to restore a route
    const originalPath = sessionStorage.getItem("originalPath");
    if (originalPath) {
      sessionStorage.removeItem("originalPath");
      const cleanPath = originalPath.replace("/finance-webapp", "") || "/";

      if (location.pathname !== cleanPath) {
        navigate(cleanPath, { replace: true });
      }
    }
  }, [navigate, location]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Provider store={store}>
        <SnackBar />
        <Router basename="/finance-webapp">
          <RouteRestorer />
          <Routes>
            <Route path="*" element={<Navigate to={SCREENS.HOME} replace />} />
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to={SCREENS.HOME} replace />} />
              <Route path={SCREENS.HOME} element={<HomePage />} />
              <Route path={SCREENS.CUSTOMERS} element={<Customers />} />
              <Route path={SCREENS.CUSTOMER_DETAILS} element={<UserDetails />} />
              <Route path={SCREENS.HANDOUTS} element={<Handouts />} />
              <Route
                path={SCREENS.HANDOUTS_DETAILS}
                element={<HandoutsDetails />}
              />
              <Route path={SCREENS.COLLECTION} element={<Collection />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
