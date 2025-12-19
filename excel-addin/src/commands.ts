// Office.js command handlers for Cascade Excel Add-in

Office.onReady(() => {
  // Register command handlers
  Office.actions.associate("executeAction", executeAction);
  Office.actions.associate("showTaskpane", showTaskpane);
  Office.actions.associate("analyzeSelection", analyzeSelection);
  Office.actions.associate("extractData", extractData);
  Office.actions.associate("generateFormula", generateFormula);
});

// Show the main taskpane
function showTaskpane(event: Office.AddinCommands.Event) {
  Office.addin.showAsTaskpane();
  event.completed();
}

// Execute a Cascade action
function executeAction(event: Office.AddinCommands.Event) {
  const action = event.source.id;
  
  Excel.run(async (context) => {
    try {
      switch (action) {
        case 'analyzeSelection':
          await analyzeSelectedRange(context);
          break;
        case 'extractData':
          await extractDataFromSelection(context);
          break;
        case 'generateFormula':
          await generateFormulaForSelection(context);
          break;
        default:
          console.warn('Unknown action:', action);
      }
      
      event.completed();
    } catch (error) {
      console.error('Error executing action:', error);
      event.completed({ error: error.message });
    }
  });
}

// Analyze the selected range
async function analyzeSelectedRange(context: Excel.RequestContext) {
  const range = context.workbook.getSelectedRange();
  range.load(['address', 'values', 'worksheet']);
  
  const worksheet = range.worksheet;
  worksheet.load('name');
  
  await context.sync();
  
  // Analyze the data
  const data = range.values as any[][];
  const analysis = analyzeData(data);
  
  // Insert analysis results
  const resultRange = range.getOffsetRange(0, range.columnCount + 1);
  resultRange.values = [
    ['Analysis Results'],
    ['Count', analysis.count],
    ['Sum', analysis.sum],
    ['Average', analysis.average],
    ['Min', analysis.min],
    ['Max', analysis.max]
  ];
  
  // Format the results
  resultRange.format.autofitColumns();
  resultRange.format.font.bold = true;
}

// Extract data from selection
async function extractDataFromSelection(context: Excel.RequestContext) {
  const range = context.workbook.getSelectedRange();
  range.load(['address', 'values', 'worksheet']);
  
  const worksheet = range.worksheet;
  worksheet.load('name');
  
  await context.sync();
  
  // Create a new worksheet for extracted data
  const newWorksheet = context.workbook.worksheets.add('Extracted Data');
  
  // Copy the selected data
  const sourceRange = range;
  const targetRange = newWorksheet.getRange('A1');
  sourceRange.copyTo(targetRange, Excel.RangeCopyType.values);
  
  // Add headers
  const headerRange = newWorksheet.getRange('A1');
  headerRange.format.font.bold = true;
  headerRange.format.fill.color = '#f0f0f0';
  
  await context.sync();
}

// Generate formula for selection
async function generateFormulaForSelection(context: Excel.RequestContext) {
  const range = context.workbook.getSelectedRange();
  range.load(['address', 'values']);
  
  await context.sync();
  
  const data = range.values as any[][];
  const hasNumbers = data.some(row => 
    row.some(cell => typeof cell === 'number' && !isNaN(cell))
  );
  
  if (hasNumbers) {
    // Generate SUM formula
    const formulaRange = range.getOffsetRange(range.rowCount, 0);
    formulaRange.formulas = [[`=SUM(${range.address})`]];
    formulaRange.format.font.bold = true;
    formulaRange.format.font.color = '#0066cc';
  }
  
  await context.sync();
}

// Analyze data and return statistics
function analyzeData(data: any[][]): {
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
} {
  const numbers: number[] = [];
  
  data.forEach(row => {
    row.forEach(cell => {
      if (typeof cell === 'number' && !isNaN(cell)) {
        numbers.push(cell);
      }
    });
  });
  
  if (numbers.length === 0) {
    return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
  }
  
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  
  return {
    count: numbers.length,
    sum: Math.round(sum * 100) / 100,
    average: Math.round(average * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100
  };
}

// Context menu actions
function analyzeSelection(event: Office.AddinCommands.Event) {
  executeAction(event);
}

function extractData(event: Office.AddinCommands.Event) {
  executeAction(event);
}

function generateFormula(event: Office.AddinCommands.Event) {
  executeAction(event);
}

// Utility functions for Cascade integration
export const CascadeCommands = {
  // Send data to Cascade API
  async sendToCascade(action: string, data: any) {
    try {
      const response = await fetch('/api/cascade/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error sending to Cascade:', error);
      throw error;
    }
  },
  
  // Get Cascade suggestions for current selection
  async getSuggestions(range: Excel.Range) {
    try {
      const rangeData = {
        address: range.address,
        values: range.values,
        worksheet: range.worksheet.name
      };
      
      const response = await fetch('/api/cascade/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rangeData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  },
  
  // Execute Cascade action
  async executeCascadeAction(action: any) {
    try {
      const response = await fetch('/api/cascade/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error executing Cascade action:', error);
      throw error;
    }
  }
};
