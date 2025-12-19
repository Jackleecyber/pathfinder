import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Loader 
} from 'lucide-react';
import { useDataConnectors } from '../hooks/useCascadeAPI';
import { DataConnector } from '@shared/types';

const DataConnectors: React.FC = () => {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  
  const { 
    connectors, 
    isLoading, 
    connectService, 
    disconnectService, 
    syncData, 
    isConnecting, 
    isDisconnecting, 
    isSyncing 
  } = useDataConnectors();

  const connectorTypes = [
    {
      id: 'bloomberg',
      name: 'Bloomberg Terminal',
      description: 'Access Bloomberg financial data and analytics',
      icon: '📊',
      color: 'primary',
      features: ['Real-time prices', 'Financial statements', 'Analyst estimates']
    },
    {
      id: 'factset',
      name: 'FactSet',
      description: 'Comprehensive financial data and analytics platform',
      icon: '📈',
      color: 'success',
      features: ['Company data', 'Market data', 'Research reports']
    },
    {
      id: 'capiq',
      name: 'Capital IQ',
      description: 'S&P Capital IQ financial data and research',
      icon: '🏢',
      color: 'info',
      features: ['Company profiles', 'Financial metrics', 'Industry analysis']
    },
    {
      id: 'refinitiv',
      name: 'Refinitiv (LSEG)',
      description: 'Financial data and analytics from Refinitiv',
      icon: '🌐',
      color: 'warning',
      features: ['Market data', 'News & research', 'Risk analytics']
    },
    {
      id: 'pitchbook',
      name: 'PitchBook',
      description: 'Private equity and venture capital data',
      icon: '💰',
      color: 'secondary',
      features: ['PE/VC data', 'Deal flow', 'Company valuations']
    }
  ];

  const getConnectorStatus = (connectorId: string) => {
    const connector = connectors.find(c => c.type === connectorId);
    return connector?.status || 'disconnected';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-muted" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-danger" />;
      default:
        return <WifiOff className="w-4 h-4 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'secondary';
      case 'error':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleConnect = async (connectorId: string) => {
    try {
      // In a real implementation, this would open a configuration modal
      // For now, we'll simulate the connection
      await connectService(connectorId, {
        apiKey: 'demo-key',
        endpoint: 'https://api.example.com'
      });
    } catch (error) {
      console.error('Error connecting service:', error);
    }
  };

  const handleDisconnect = async (connectorId: string) => {
    try {
      await disconnectService(connectorId);
    } catch (error) {
      console.error('Error disconnecting service:', error);
    }
  };

  const handleSync = async (connectorId: string) => {
    try {
      await syncData(connectorId, {
        dataTypes: ['financials', 'market_data'],
        dateRange: '1Y'
      });
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  const handleConfigure = (connectorId: string) => {
    setSelectedConnector(connectorId);
    setShowConfig(true);
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <Loader className="w-6 h-6 animate-spin mb-2" />
          <div className="text-muted">Loading connectors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <div className="card-header">
        <h6 className="mb-0">Data Connectors</h6>
        <small className="text-muted">
          Connect to external data sources for real-time financial data
        </small>
      </div>

      {/* Connectors List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <AnimatePresence>
            {connectorTypes.map((connector) => {
              const status = getConnectorStatus(connector.id);
              const isConnected = status === 'connected';
              
              return (
                <motion.div
                  key={connector.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card mb-3"
                >
                  <div className="card-body">
                    <div className="d-flex align-items-start">
                      {/* Connector Icon */}
                      <div className="mr-3">
                        <div 
                          className={`badge badge-${connector.color} d-flex align-items-center justify-content-center`}
                          style={{ width: '48px', height: '48px', fontSize: '20px' }}
                        >
                          {connector.icon}
                        </div>
                      </div>
                      
                      {/* Connector Info */}
                      <div className="flex-1">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0">{connector.name}</h6>
                          <div className="d-flex align-items-center">
                            {getStatusIcon(status)}
                            <span className={`badge badge-${getStatusColor(status)} ml-2`}>
                              {status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted text-sm mb-2">
                          {connector.description}
                        </p>
                        
                        <div className="mb-3">
                          <strong className="text-sm">Features:</strong>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {connector.features.map((feature, index) => (
                              <span key={index} className="badge badge-light text-sm">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="d-flex gap-2">
                          {!isConnected ? (
                            <button
                              onClick={() => handleConnect(connector.id)}
                              className="btn btn-sm btn-primary"
                              disabled={isConnecting}
                            >
                              {isConnecting ? (
                                <Loader className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <Wifi className="w-3 h-3 mr-1" />
                              )}
                              Connect
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleSync(connector.id)}
                                className="btn btn-sm btn-outline-primary"
                                disabled={isSyncing}
                              >
                                {isSyncing ? (
                                  <Loader className="w-3 h-3 animate-spin mr-1" />
                                ) : (
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                )}
                                Sync Data
                              </button>
                              
                              <button
                                onClick={() => handleConfigure(connector.id)}
                                className="btn btn-sm btn-outline-secondary"
                              >
                                <Settings className="w-3 h-3 mr-1" />
                                Configure
                              </button>
                              
                              <button
                                onClick={() => handleDisconnect(connector.id)}
                                className="btn btn-sm btn-outline-danger"
                                disabled={isDisconnecting}
                              >
                                Disconnect
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfig && selectedConnector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ 
              top: 0, 
              left: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              zIndex: 1000 
            }}
            onClick={() => setShowConfig(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="card"
              style={{ width: '500px', maxWidth: '90vw' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0">
                  Configure {connectorTypes.find(c => c.id === selectedConnector)?.name}
                </h6>
                <button
                  onClick={() => setShowConfig(false)}
                  className="btn btn-sm btn-link p-0"
                >
                  ×
                </button>
              </div>
              
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">API Key</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your API key"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Endpoint URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://api.example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Data Types</label>
                  <div className="d-flex flex-wrap gap-2">
                    {['Financials', 'Market Data', 'News', 'Research'].map((type) => (
                      <label key={type} className="form-check">
                        <input type="checkbox" className="form-check-input" defaultChecked />
                        <span className="form-check-label">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card-footer d-flex justify-content-end gap-2">
                <button
                  onClick={() => setShowConfig(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleConnect(selectedConnector);
                    setShowConfig(false);
                  }}
                  className="btn btn-primary"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="card-footer">
        <div className="text-muted text-sm">
          <strong>💡 Note:</strong> Some connectors require separate subscriptions and API keys.
          Contact your administrator for access credentials.
        </div>
      </div>
    </div>
  );
};

export default DataConnectors;
