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
  const totalGiven = () => {
    const givenDetails = {
      total: 0,
      givenToCustomer: 0,
      profit: 0,
    }

    handouts.forEach(item => {
      const bondAmt = item.amount <= 5000 ? 50 : 100
      const profit = (item.amount / 10) + bondAmt
      givenDetails.total += item.amount
      givenDetails.givenToCustomer += (item.amount - profit)
      givenDetails.profit += profit
    })

    return givenDetails
  }
  const { total, givenToCustomer, profit } = totalGiven()

  return (
    <div className="handouts-container">
      <Link to="/" className="back-link">← Back to Home</Link>

      <h1>Handouts Management</h1>

      <div className="form-section">
        <h2>Add New Handout</h2>
        <FormDataComp />
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
                    <TableCell>{handout.name || "-"}</TableCell>
                    <TableCell>{handout.mobile|| "-"}</TableCell>
                    <TableCell>{handout.nominee || "-"}</TableCell>
                    <TableCell>{handout.amount || "-"}</TableCell>
                    <TableCell>{handout.date || "-"}</TableCell>
                    <TableCell>{handout.address || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No handouts records found.</p>
        )}

        <div className="given-summary">
          <p>Total given: {total}</p>
          <p>Total actual given: {givenToCustomer}</p>
          <p>Profit: {profit}</p>
        </div>
      </div>
    </div>
  );
}

export default Handouts;