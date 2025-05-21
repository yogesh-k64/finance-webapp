// src/utils/exportToExcel.ts
import * as XLSX from 'xlsx';

import type { RootState } from '../store/store';

export const exportToExcel = (state: RootState) => {
  // Prepare data for each sheet
  const handoutsData = state.handouts.items.map(item => ({
    Name: item.name,
    Mobile: item.mobile,
    Nominee: item.nominee,
    Amount: item.amount,
    Date: item.date,
    Address: item.address
  }));

  const collectionsData = state.collection.items.map(item => ({
    Name: item.name,
    Amount: item.amount,
    Date: item.date,
    HandoutID: item.handoutId
  }));

  // Create workbook with multiple sheets
  const workbook = XLSX.utils.book_new();
  
  const handoutsSheet = XLSX.utils.json_to_sheet(handoutsData);
  XLSX.utils.book_append_sheet(workbook, handoutsSheet, "Handouts");
  
  const collectionsSheet = XLSX.utils.json_to_sheet(collectionsData);
  XLSX.utils.book_append_sheet(workbook, collectionsSheet, "Collections");

  // Generate file and trigger download
  const fileName = `handouts_export_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};