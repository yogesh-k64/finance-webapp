import { DATE_PICKER_FORMAT, INITIAL_FILTER_DATE, SCREENS } from '../utils/constants';
import { getCollectionSummary, getHandoutSummary } from '../utils/utilsFunction';

import DatePicker from 'react-multi-date-picker';
import JsonStorageControls from './ImportComp';
import { useCollectionList } from '../store/collectionSlice';
import { useHandoutsList } from '../store/handoutsSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const allHandouts = useSelector(useHandoutsList);
  const allCollectionList = useSelector(useCollectionList);
  const [values, setValues] = useState(INITIAL_FILTER_DATE)

  const [fromDate, endDate] = values
  const fromDateObj = new Date(fromDate?.toString())
  const endDateObj = new Date(endDate?.toString())
  const handouts = allHandouts.filter(item => {
    return new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj
  })
  const collectionList = allCollectionList.filter(item => {
    return new Date(item.date) >= fromDateObj &&
      new Date(item.date) <= endDateObj
  })
  const handoutsSummary = getHandoutSummary(handouts, fromDateObj, endDateObj)
  const collectionSummary = getCollectionSummary(collectionList, fromDateObj, endDateObj);

  const getOverAllSummary = () => {
    return {
      balance: collectionSummary.total - handoutsSummary.givenToCustomer 
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
      <div className="filter-date">
        <span className='title' >Select Dates</span>
        <DatePicker
          format={DATE_PICKER_FORMAT}
          value={values}
          onChange={setValues}
          range
          dateSeparator="  To  "
        />
      </div>
      <div className='homepage-summary' >
        <p>Total Given: {handoutsSummary.givenToCustomer}</p>
        <p>Collection: {collectionSummary.total}</p>
        <p>Last week Balance: {0}</p>
        <p>Balance: {getOverAllSummary().balance}</p>
      </div>
      <JsonStorageControls />
    </div>
  );
}

export default HomePage;