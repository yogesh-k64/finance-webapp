import { exportToJson, importFromJson } from '../utils/importExportFile';

const JsonStorageControls = () => {

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importFromJson(file)
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginRight: '2rem' }}>
      <div className='action-btn' onClick={() => exportToJson()} >
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