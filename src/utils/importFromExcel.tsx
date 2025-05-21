// src/utils/importFromExcel.ts
import * as XLSX from 'xlsx';
import { Handout, Collection } from '../utils/interface';
import { AppDispatch } from '../store/store';

interface ExcelData {
  handouts: Handout[];
  collections: Collection[];
}

export const importFromExcel = (file: File, dispatch: AppDispatch): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result: ExcelData = {
          handouts: [],
          collections: []
        };

        // Process Handouts sheet
        if (workbook.Sheets['Handouts']) {
          const handoutsSheet = workbook.Sheets['Handouts'];
          result.handouts = XLSX.utils.sheet_to_json<Handout>(handoutsSheet);
        }

        // Process Collections sheet
        if (workbook.Sheets['Collections']) {
          const collectionsSheet = workbook.Sheets['Collections'];
          result.collections = XLSX.utils.sheet_to_json<Collection>(collectionsSheet);
        }

        // Dispatch actions to update Redux
        if (result.handouts.length > 0) {
          dispatch(handoutsSlice.actions.replaceAllHandouts(result.handouts));
        }
        
        if (result.collections.length > 0) {
          dispatch(collectionSlice.actions.replaceAllCollections(result.collections));
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};