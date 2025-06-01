import TableComponentV1 from '../common/TableComponent';

function Customers() {

  return (
    <div className='handouts-container' >
      {/* <div className="form-section">
        <h2>Add New Customer</h2>
        <FormDataComp /> 
      </div>*/}
      <div className="table-section">
        <h2>Customer Records</h2>
        <TableComponentV1 headCell={[]} list={[]} />
      </div>
    </div>
  );
}

export default Customers;
