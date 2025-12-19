import { useState, useEffect } from 'react';
import { ExcelWorkbook, ExcelWorksheet, ExcelRange } from '@shared/types';

export const useExcelContext = () => {
  const [workbook, setWorkbook] = useState<ExcelWorkbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeExcel = async () => {
      try {
        await Excel.run(async (context) => {
          const workbook = context.workbook;
          workbook.load(['name']);
          
          const worksheets = workbook.worksheets;
          worksheets.load(['items/name', 'items/id', 'items/isActive']);
          
          await context.sync();
          
          const excelWorkbook: ExcelWorkbook = {
            name: workbook.name,
            worksheets: worksheets.items.map((ws: any) => ({
              name: ws.name,
              id: ws.id,
              isActive: ws.isActive,
              ranges: []
            })),
            activeWorksheet: worksheets.items.find((ws: any) => ws.isActive)?.name || '',
            metadata: {
              author: 'Unknown',
              created: new Date().toISOString(),
              modified: new Date().toISOString()
            }
          };
          
          setWorkbook(excelWorkbook);
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Error initializing Excel context:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    initializeExcel();
  }, []);

  const getSelectedRange = async (): Promise<ExcelRange | null> => {
    try {
      return await Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.load(['address', 'values', 'worksheet']);
        
        const worksheet = range.worksheet;
        worksheet.load('name');
        
        await context.sync();
        
        return {
          address: range.address,
          worksheet: worksheet.name,
          values: range.values as any[][]
        };
      });
    } catch (err) {
      console.error('Error getting selected range:', err);
      return null;
    }
  };

  const insertData = async (rangeAddress: string, data: any[][]) => {
    try {
      await Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.load(['address']);
        
        await context.sync();
        
        // If no specific range is provided, use selected range
        const targetRange = rangeAddress ? 
          context.workbook.getRange(rangeAddress) : 
          range;
        
        targetRange.values = data;
        await context.sync();
      });
    } catch (err) {
      console.error('Error inserting data:', err);
      throw err;
    }
  };

  const insertFormula = async (rangeAddress: string, formula: string) => {
    try {
      await Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.load(['address']);
        
        await context.sync();
        
        const targetRange = rangeAddress ? 
          context.workbook.getRange(rangeAddress) : 
          range;
        
        targetRange.formulas = [[formula]];
        await context.sync();
      });
    } catch (err) {
      console.error('Error inserting formula:', err);
      throw err;
    }
  };

  const createChart = async (chartType: string, dataRange: string, options: any) => {
    try {
      await Excel.run(async (context) => {
        const worksheet = context.workbook.worksheets.getActiveWorksheet();
        const range = context.workbook.getRange(dataRange);
        
        const chart = worksheet.charts.add(chartType, range, options);
        chart.load(['name']);
        
        await context.sync();
        
        return chart.name;
      });
    } catch (err) {
      console.error('Error creating chart:', err);
      throw err;
    }
  };

  const getWorksheetData = async (worksheetName?: string) => {
    try {
      return await Excel.run(async (context) => {
        const worksheet = worksheetName ? 
          context.workbook.worksheets.getItem(worksheetName) :
          context.workbook.worksheets.getActiveWorksheet();
        
        worksheet.load(['name', 'usedRange']);
        
        const usedRange = worksheet.getUsedRange();
        usedRange.load(['address', 'values']);
        
        await context.sync();
        
        return {
          name: worksheet.name,
          data: usedRange.values as any[][],
          address: usedRange.address
        };
      });
    } catch (err) {
      console.error('Error getting worksheet data:', err);
      return null;
    }
  };

  const addWorksheet = async (name: string) => {
    try {
      await Excel.run(async (context) => {
        const worksheet = context.workbook.worksheets.add(name);
        worksheet.load(['name', 'id']);
        
        await context.sync();
        
        return {
          name: worksheet.name,
          id: worksheet.id
        };
      });
    } catch (err) {
      console.error('Error adding worksheet:', err);
      throw err;
    }
  };

  const deleteWorksheet = async (name: string) => {
    try {
      await Excel.run(async (context) => {
        const worksheet = context.workbook.worksheets.getItem(name);
        worksheet.delete();
        
        await context.sync();
      });
    } catch (err) {
      console.error('Error deleting worksheet:', err);
      throw err;
    }
  };

  return {
    workbook,
    isLoading,
    error,
    getSelectedRange,
    insertData,
    insertFormula,
    createChart,
    getWorksheetData,
    addWorksheet,
    deleteWorksheet
  };
};
