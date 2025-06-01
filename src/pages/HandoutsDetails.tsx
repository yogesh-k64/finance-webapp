import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { HeadCell } from '../utils/interface';
import { SCREENS } from '../utils/constants';
import TableComponentV1 from '../common/TableComponent';
import { copyToClipboard } from '../utils/utilsFunction';
import { useHandoutsList } from '../store/handoutsSlice';
import { useSelector } from 'react-redux';

const HandoutsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handout = useSelector(useHandoutsList).find(item => item.id === id);
  const headCell: HeadCell[] = [
    { label: "name" },
    { label: "amount" },
    { label: "date" },
    { label: "handoutId" },
  ]

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
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }} className="handouts-details-container" >
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
          <DetailItem label="Id" value={handout.id}
            icon={<>{<ContentCopyIcon className='copy-icon' onClick={() => copyToClipboard(handout.id)} />}</>} />
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

const DetailItem = ({ label, value, fullWidth = false, icon }: {
  label: string, value: string, fullWidth?: boolean,
  icon?: React.ReactNode
}) => (
  <Box sx={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5 }}>
      {value || '-'}{icon && <span style={{ marginLeft: '8px' }}>{icon}</span>}
    </Typography>
  </Box>
);

export default HandoutsDetails
