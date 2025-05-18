import '../App.css';

import { SCREENS } from '../utils/constants';
import { useCollectionSummary } from '../store/collectionSlice';
import { useHandoutsSummary } from '../store/handoutsSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HomePage() {
  const navigate = useNavigate();
  const collectionSummary = useSelector(useCollectionSummary);
  const handoutsSummary = useSelector(useHandoutsSummary);

  const getOverAllSummary = () => {
    return {
      balance: handoutsSummary.givenToCustomer - collectionSummary.total
    }
  }
  return (
    <div className="home-container">
      <h1>Finance Manager</h1>
      <div className="button-group">
        <button onClick={() => navigate(SCREENS.CUSTOMERS)} className="nav-button">
          Customers
        </button>
        <button onClick={() => navigate(SCREENS.HANDOUTS)} className="nav-button">
          Handouts
        </button>
        <button onClick={() => navigate(SCREENS.COLLECTION)} className="nav-button">
          Collection
        </button>
      </div>
      <div>
        <p>Total Given: {handoutsSummary.givenToCustomer}</p>
        <p>Collection: {collectionSummary.total}</p>
        <p>Last week Balance: {0}</p>
        <p>Balance: {getOverAllSummary().balance}</p>
      </div>
    </div>
  );
}

export default HomePage;