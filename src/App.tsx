import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Collection from './pages/Collection';
import Customers from './pages/Customer';
import Handouts from './pages/Handouts';
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import { SCREENS } from './utils/constants';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <Router basename="/finance-webapp" >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={SCREENS.HOME} element={<HomePage />} />
          <Route path={SCREENS.CUSTOMERS} element={<Customers />} />
          <Route path={SCREENS.HANDOUTS} element={<Handouts />} />
          <Route path={SCREENS.COLLECTION} element={<Collection />} />
        </Routes>
      </Router>
    </Provider>

  );
}

export default App;