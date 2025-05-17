import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Collection from './pages/Collection';
import Customers from './pages/Customer';
import Handouts from './pages/Handouts';
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home"  element={<HomePage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/handouts" element={<Handouts />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </Router>
    </Provider>

  );
}

export default App;