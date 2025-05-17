import '../App.css';

import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the App</h1>
      <div className="button-group">
        <button onClick={() => navigate('/customers')} className="nav-button">
          Customers
        </button>
        <button onClick={() => navigate('/handouts')} className="nav-button">
          Handouts
        </button>
        <button onClick={() => navigate('/collection')} className="nav-button">
          Collection
        </button>
      </div>
    </div>
  );
}

export default HomePage;