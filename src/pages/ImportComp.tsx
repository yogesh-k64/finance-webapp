import { exportToJson, importFromJson } from '../utils/importExportFile';
import { useDispatch, useSelector } from 'react-redux';

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
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginRight: '2rem' }}>
      <div className='action-btn' onClick={() => exportToJson(state)} >
        <span>Export Data</span>
      </div>
      <input
        accept=".json"
        style={{ display: 'none' }}
        id="json-upload"
        type="file"
        onChange={handleImport}
      />
      <label htmlFor="json-upload">
        <div className='action-btn' >
          <span>Import Data</span>
        </div>
      </label>
    </div>
  );
};

export default JsonStorageControls;