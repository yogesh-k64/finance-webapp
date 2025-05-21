import { exportToJson, importFromJson } from '../utils/importExportFile';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import type { RootState } from '../store/store';

const JsonStorageControls = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importFromJson(file, dispatch)
      .then(() => alert('Data imported successfully!'))
      .catch(err => alert(`Error: ${err.message}`));
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', justifyContent: 'space-between' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={() => exportToJson(state)}
      >
        Export to JSON
      </Button>
      
      <input
        accept=".json"
        style={{ display: 'none' }}
        id="json-upload"
        type="file"
        onChange={handleImport}
      />
      <label htmlFor="json-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Import JSON
        </Button>
      </label>
    </div>
  );
};

export default JsonStorageControls;