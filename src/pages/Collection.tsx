import { Link } from 'react-router-dom';

function Collection() {
  return (
    <div>
      <h1>Collection Page</h1>
      <p>This is the collection screen.</p>
      <Link to="/">Back to HomePage</Link>
    </div>
  );
}

export default Collection;