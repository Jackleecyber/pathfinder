import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  BarChart3, 
  Table, 
  FileText, 
  TrendingUp, 
  X,
  Loader 
} from 'lucide-react';
import { ExcelRange, CascadeAction } from '@shared/types';
import { useCascadeAPI } from '../hooks/useCascadeAPI';

interface CursorWidgetProps {
  position: { x: number; y: number };
  selectedRange: ExcelRange;
  onActionExecute: (action: CascadeAction) => Promise<void>;
  onClose: () => void;
}

const CursorWidget: React.FC<CursorWidgetProps> = ({
  position,
  selectedRange,
  onActionExecute,
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<CascadeAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { calculateMetrics } = useCascadeAPI();

  // Generate contextual suggestions based on selected range
  useEffect(() => {
    const generateSuggestions = async () => {
      setIsLoading(true);
      
      try {
        // Analyze the selected range data
        const data = selectedRange.values;
        const hasNumbers = data.some(row => 
          row.some(cell => typeof cell === 'number' && !isNaN(cell))
        );
        
        const suggestions: CascadeAction[] = [];
        
        if (hasNumbers) {
          // Generate suggestions based on data analysis
          suggestions.push({
            id: `analyze_${Date.now()}`,
            type: 'analyze_financials',
            payload: {
              analysisType: 'basic_metrics',
              metrics: ['sum', 'average', 'min', 'max', 'count']
            },
            confidence: 0.9,
            timestamp: new Date().toISOString()
          });
          
          suggestions.push({
            id: `formula_${Date.now()}`,
            type: 'generate_formula',
            payload: {
              formula: '=SUM(' + selectedRange.address + ')',
              description: 'Calculate sum of selected range'
            },
            confidence: 0.95,
            timestamp: new Date().toISOString()
          });
          
          suggestions.push({
            id: `chart_${Date.now()}`,
            type: 'create_chart',
            payload: {
              chartType: 'ColumnClustered',
              dataRange: selectedRange.address,
              title: 'Data Visualization'
            },
            confidence: 0.8,
            timestamp: new Date().toISOString()
          });
        }
        
        // Add general suggestions
        suggestions.push({
          id: `pivot_${Date.now()}`,
          type: 'build_pivot',
          payload: {
            rows: ['Category'],
            columns: ['Period'],
            values: ['Value']
          },
          confidence: 0.7,
          timestamp: new Date().toISOString()
        });
        
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestions();
  }, [selectedRange]);

  const handleActionClick = async (action: CascadeAction) => {
    try {
      await onActionExecute(action);
      setIsVisible(false);
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'generate_formula':
        return <Calculator className="w-4 h-4" />;
      case 'create_chart':
        return <BarChart3 className="w-4 h-4" />;
      case 'build_pivot':
        return <Table className="w-4 h-4" />;
      case 'analyze_financials':
        return <TrendingUp className="w-4 h-4" />;
      case 'extract_data':
        return <FileText className="w-4 h-4" />;
      default:
        return <Calculator className="w-4 h-4" />;
    }
  };

  const getActionTitle = (type: string) => {
    switch (type) {
      case 'generate_formula':
        return 'Create Formula';
      case 'create_chart':
        return 'Create Chart';
      case 'build_pivot':
        return 'Build Pivot';
      case 'analyze_financials':
        return 'Analyze Data';
      case 'extract_data':
        return 'Extract Data';
      default:
        return 'Execute Action';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="position-fixed"
      style={{
        left: Math.min(position.x + 10, window.innerWidth - 300),
        top: Math.min(position.y + 10, window.innerHeight - 200),
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
    >
      <div className="card shadow-lg" style={{ width: '280px' }}>
        <div className="card-header d-flex align-items-center justify-content-between">
          <div>
            <h6 className="mb-0">Quick Actions</h6>
            <small className="text-muted">
              {selectedRange.worksheet}!{selectedRange.address}
            </small>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-link p-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="card-body p-2">
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center py-3">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              <span className="text-muted">Analyzing selection...</span>
            </div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {suggestions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleActionClick(action)}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-start"
                  style={{ textAlign: 'left' }}
                >
                  {getActionIcon(action.type)}
                  <span className="ml-2">{getActionTitle(action.type)}</span>
                  <div className="ml-auto">
                    <div 
                      className={`badge badge-sm ${
                        action.confidence >= 0.8 ? 'badge-success' : 
                        action.confidence >= 0.6 ? 'badge-warning' : 'badge-danger'
                      }`}
                    >
                      {Math.round(action.confidence * 100)}%
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
        
        <div className="card-footer">
          <small className="text-muted">
            Click any action to apply it to your selection
          </small>
        </div>
      </div>
    </motion.div>
  );
};

export default CursorWidget;
