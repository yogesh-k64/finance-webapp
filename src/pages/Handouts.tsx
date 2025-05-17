import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import FormDataComp from './FormDataComp';
import { Link } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useSelector } from 'react-redux';

function Handouts() {
  const handouts = useSelector((state: RootState) => state.handouts.items);


  return (
    <div className="handouts-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <h1>Handouts Management</h1>
      
      <div className="form-section">
        <h2>Add New Handout</h2>
        <FormDataComp/>
      </div>
      
      <div className="table-section">
        <h2>Handouts Records</h2>
        {handouts.length > 0 ? (
          <TableContainer component={Paper} className="handouts-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Nominee</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {handouts.map(handout => (
                  <TableRow key={handout.id}>
                    <TableCell>{handout.name}</TableCell>
                    <TableCell>{handout.mobile}</TableCell>
                    <TableCell>{handout.nominee}</TableCell>
                    <TableCell>{handout.amount}</TableCell>
                    <TableCell>{handout.date}</TableCell>
                    <TableCell>{handout.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No handouts records found.</p>
        )}
      </div>
    </div>
  );
}

export default Handouts;