import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import DataConnectors from './components/DataConnectors';
import CursorWidget from './components/CursorWidget';
import { useExcelContext } from './hooks/useExcelContext';
import { useCascadeAPI } from './hooks/useCascadeAPI';
import { CascadeAction, ExcelRange } from '@shared/types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'connectors'>('chat');
  const [selectedRange, setSelectedRange] = useState<ExcelRange | null>(null);
  const [showCursorWidget, setShowCursorWidget] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const { workbook, isLoading: excelLoading } = useExcelContext();
  const { isConnected } = useCascadeAPI();

  // Listen for Excel selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.load(['address', 'values', 'worksheet']);
        
        await context.sync();
        
        const worksheet = range.worksheet;
        worksheet.load('name');
        await context.sync();
        
        const excelRange: ExcelRange = {
          address: range.address,
          worksheet: worksheet.name,
          values: range.values as any[][]
        };
        
        setSelectedRange(excelRange);
        
        // Show cursor widget if range is selected
        if (range.address !== 'A1:A1') {
          setShowCursorWidget(true);
        }
      }).catch(console.error);
    };

    // Set up event listener for selection changes
    Excel.addHandler(Excel.EventType.SelectionChanged, handleSelectionChange);
    
    return () => {
      Excel.removeHandler(Excel.EventType.SelectionChanged, handleSelectionChange);
    };
  }, []);

  // Handle cursor widget visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setShowCursorWidget(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleActionExecute = async (action: CascadeAction) => {
    try {
      await Excel.run(async (context) => {
        switch (action.type) {
          case 'insert_values':
            const range = context.workbook.getSelectedRange();
            range.values = action.payload.values;
            break;
            
          case 'generate_formula':
            const formulaRange = context.workbook.getSelectedRange();
            formulaRange.formulas = [[action.payload.formula]];
            break;
            
          case 'create_chart':
            const chartRange = context.workbook.getSelectedRange();
            const chart = context.workbook.worksheets.getActiveWorksheet().charts.add(
              action.payload.chartType,
              chartRange,
              action.payload.chartOptions
            );
            break;
            
          default:
            console.warn('Unknown action type:', action.type);
        }
        
        await context.sync();
      });
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  if (excelLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <div className="loading-spinner mb-2"></div>
          <div className="text-muted">Connecting to Excel...</div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <div className="text-danger mb-2">⚠️</div>
          <div className="text-muted">Unable to connect to Cascade services</div>
          <div className="text-muted">Please check your internet connection</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="mb-0">Cascade</h2>
            <small className="text-muted">AI Finance Assistant</small>
          </div>
          <div className="d-flex align-items-center">
            <div className="text-success">●</div>
            <small className="text-muted ml-1">Connected</small>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card-header">
        <div className="d-flex">
          <button
            className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 Upload
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'connectors' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('connectors')}
          >
            🔌 Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-100"
            >
              <ChatInterface
                selectedRange={selectedRange}
                onActionExecute={handleActionExecute}
              />
            </motion.div>
          )}
          
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-100"
            >
              <FileUpload />
            </motion.div>
          )}
          
          {activeTab === 'connectors' && (
            <motion.div
              key="connectors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-100"
            >
              <DataConnectors />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cursor Widget */}
      {showCursorWidget && selectedRange && (
        <CursorWidget
          position={cursorPosition}
          selectedRange={selectedRange}
          onActionExecute={handleActionExecute}
          onClose={() => setShowCursorWidget(false)}
        />
      )}
    </div>
  );
};

export default App;
