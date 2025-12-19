import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { CascadeAction } from '@shared/types';

interface ActionPreviewProps {
  action: CascadeAction;
  onExecute: () => void;
  isExecuting?: boolean;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ 
  action, 
  onExecute, 
  isExecuting = false 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'insert_values':
        return '📊';
      case 'generate_formula':
        return '🧮';
      case 'create_chart':
        return '📈';
      case 'build_pivot':
        return '🔄';
      case 'extract_data':
        return '📤';
      case 'analyze_financials':
        return '📋';
      default:
        return '⚡';
    }
  };

  const getActionTitle = (type: string) => {
    switch (type) {
      case 'insert_values':
        return 'Insert Data';
      case 'generate_formula':
        return 'Generate Formula';
      case 'create_chart':
        return 'Create Chart';
      case 'build_pivot':
        return 'Build Pivot Table';
      case 'extract_data':
        return 'Extract Data';
      case 'analyze_financials':
        return 'Analyze Financials';
      default:
        return 'Execute Action';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-danger';
  };

  const formatPreview = () => {
    switch (action.type) {
      case 'insert_values':
        return (
          <div>
            <strong>Data to insert:</strong>
            <pre className="bg-light p-2 rounded mt-1" style={{ fontSize: '12px' }}>
              {JSON.stringify(action.payload.values, null, 2)}
            </pre>
          </div>
        );
      
      case 'generate_formula':
        return (
          <div>
            <strong>Formula:</strong>
            <code className="bg-light p-2 rounded d-block mt-1">
              {action.payload.formula}
            </code>
            {action.payload.description && (
              <div className="text-muted mt-1">
                {action.payload.description}
              </div>
            )}
          </div>
        );
      
      case 'create_chart':
        return (
          <div>
            <strong>Chart Type:</strong> {action.payload.chartType}
            <br />
            <strong>Data Range:</strong> {action.payload.dataRange}
            {action.payload.title && (
              <>
                <br />
                <strong>Title:</strong> {action.payload.title}
              </>
            )}
          </div>
        );
      
      case 'build_pivot':
        return (
          <div>
            <strong>Rows:</strong> {action.payload.rows?.join(', ')}
            <br />
            <strong>Columns:</strong> {action.payload.columns?.join(', ')}
            <br />
            <strong>Values:</strong> {action.payload.values?.join(', ')}
          </div>
        );
      
      case 'extract_data':
        return (
          <div>
            <strong>Source:</strong> {action.payload.source}
            <br />
            <strong>Target:</strong> {action.payload.targetRange}
          </div>
        );
      
      case 'analyze_financials':
        return (
          <div>
            <strong>Analysis Type:</strong> {action.payload.analysisType}
            <br />
            <strong>Metrics:</strong> {action.payload.metrics?.join(', ')}
          </div>
        );
      
      default:
        return (
          <div>
            <strong>Action:</strong> {action.type}
            <pre className="bg-light p-2 rounded mt-1" style={{ fontSize: '12px' }}>
              {JSON.stringify(action.payload, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card mb-2"
    >
      <div className="card-body p-2">
        {/* Action Header */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <span className="mr-2" style={{ fontSize: '16px' }}>
              {getActionIcon(action.type)}
            </span>
            <div>
              <div className="font-weight-bold">
                {getActionTitle(action.type)}
              </div>
              <div className={`text-sm ${getConfidenceColor(action.confidence)}`}>
                Confidence: {Math.round(action.confidence * 100)}%
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center">
            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn btn-sm btn-secondary mr-1"
              title="Preview"
            >
              <Eye className="w-3 h-3" />
            </button>
            
            {/* Execute Button */}
            <button
              onClick={onExecute}
              disabled={isExecuting}
              className="btn btn-sm btn-primary"
              title="Execute"
            >
              {isExecuting ? (
                <Loader className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Preview Content */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-top pt-2"
          >
            {formatPreview()}
          </motion.div>
        )}

        {/* Provenance */}
        {action.provenance && (
          <div className="mt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-sm btn-link p-0 text-muted"
              style={{ fontSize: '11px' }}
            >
              {isExpanded ? 'Hide' : 'Show'} source details
            </button>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1"
              >
                <div className="text-muted" style={{ fontSize: '11px' }}>
                  <div><strong>Source:</strong> {action.provenance.source}</div>
                  {action.provenance.filePath && (
                    <div><strong>File:</strong> {action.provenance.filePath}</div>
                  )}
                  {action.provenance.url && (
                    <div><strong>URL:</strong> {action.provenance.url}</div>
                  )}
                  {action.provenance.pageNumber && (
                    <div><strong>Page:</strong> {action.provenance.pageNumber}</div>
                  )}
                  <div><strong>Method:</strong> {action.provenance.extractionMethod}</div>
                  <div><strong>Time:</strong> {new Date(action.provenance.timestamp).toLocaleString()}</div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActionPreview;
