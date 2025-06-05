import './styles/app.scss'

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import Collection from './pages/Collection';
import Customers from './pages/Customer';
import Dashboard from './pages/DashBoard';
import Handouts from './pages/Handouts';
import HandoutsDetails from './pages/HandoutsDetails';
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import { SCREENS } from './utils/constants';
import SnackBar from './common/Snackbar';
import { store } from './store/store';

const customTheme = createTheme({
  typography: {
    fontFamily: "Nunito, sans-serif"
  }
});
function App() {
  return (
    <ThemeProvider theme={customTheme} >
      <Provider store={store}>
        <SnackBar />
        <Router basename="/finance-webapp" >
          <Routes>
            <Route path="*" element={<Navigate to={SCREENS.HOME} replace />} />
            <Route path="/" element={<Dashboard />} >
              <Route index element={<Navigate to={SCREENS.HOME} replace />} />
              <Route path={SCREENS.HOME} element={<HomePage />} />
              <Route path={SCREENS.CUSTOMERS} element={<Customers />} />
              <Route path={SCREENS.HANDOUTS} element={<Handouts />} />
              <Route path={SCREENS.HANDOUTS_DETAILS} element={<HandoutsDetails />} />
              <Route path={SCREENS.COLLECTION} element={<Collection />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>

  );
}

export default App;