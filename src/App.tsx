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
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider, useDispatch } from "react-redux";
import { SCREENS } from "./utils/constants";
import SnackBar from "./common/Snackbar";
import { store } from "./store/store";
import { useEffect } from "react";
import { logout } from "./store/authSlice";

const customTheme = createTheme({
  typography: {
    fontFamily: "Nunito, sans-serif",
  },
});

function AuthExpirationHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(logout());
      navigate(SCREENS.LOGIN, { replace: true });
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [navigate, dispatch]);

  return null;
}

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
          <AuthExpirationHandler />
          <RouteRestorer />
          <Routes>
            {/* Public route */}
            <Route 
              path={SCREENS.LOGIN} 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/" 
              element={<Dashboard />}
            >
              <Route index element={<Navigate to={SCREENS.HOME} replace />} />
              <Route path="home" element={<HomePage />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<UserDetails />} />
              <Route path="handouts" element={<Handouts />} />
              <Route path="handouts/:id" element={<HandoutsDetails />} />
              <Route path="collection" element={<Collection />} />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to={SCREENS.LOGIN} replace />} />
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
