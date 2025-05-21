import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SCREENS } from '../utils/constants';
import TableComponentV1 from '../common/TableComponent';
import { useHandoutsList } from '../store/handoutsSlice';
import { useSelector } from 'react-redux';

const HandoutsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handout = useSelector(useHandoutsList).find(item => item.id === id);
  const headCell = ["name", "amount", "date", "handoutId"]

  if (!handout) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Handout not found</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(SCREENS.HANDOUTS)}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(SCREENS.HANDOUTS)}
        sx={{ mb: 3 }}
      >
        Back to Handouts
      </Button>

      <Typography variant="h4" gutterBottom>
        Handout Details
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <DetailItem label="Name" value={handout.name} />
          <DetailItem label="Mobile" value={handout.mobile} />
          <DetailItem label="Nominee" value={handout.nominee} />
          <DetailItem label="Amount" value={`₹${handout.amount}`} />
          <DetailItem label="Date" value={handout.date} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <DetailItem label="Address" value={handout.address} fullWidth />
        </Box>
      </Paper>
      <Box sx={{ mt: 3, mb: 2 }}>
        <span className="title" >Collection Records</span>
      </Box>
      <TableComponentV1 headCell={headCell} list={handout.collection} />
    </Box>
  );
};

const DetailItem = ({ label, value, fullWidth = false }: { label: string, value: string, fullWidth?: boolean }) => (
  <Box sx={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5 }}>
      {value || '-'}
    </Typography>
  </Box>
);

export default HandoutsDetails
