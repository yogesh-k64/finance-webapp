import FormDataComp from './FormDataComp';
import { Link } from 'react-router-dom';
import type { RootState } from '../store/store';
import TableComponentV1 from '../common/TableComponent';
import { useSelector } from 'react-redux';

function Customers() {

  const customerList = useSelector((state: RootState) => state.handouts.items);
  const headCell = ["name", "mobile", "nominee", "amount", "date", "address"]

  return (
    <div>
      <h1>Customers Page</h1>
      <p>This is the customers screen.</p>
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1>Customer Management</h1>
      <div className="form-section">
        <h2>Add New Customer</h2>
        <FormDataComp />
      </div>
      <div className="table-section">
        <h2>Customer Records</h2>
        <TableComponentV1 headCell={headCell} list={customerList} />
      </div>
    </div>
  );
}

export default Customers;
