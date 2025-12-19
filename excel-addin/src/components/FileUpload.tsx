import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Table, 
  Trash2, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Loader 
} from 'lucide-react';
import { useFileUpload } from '../hooks/useCascadeAPI';
import { FileUpload as FileUploadType } from '@shared/types';

const FileUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const { 
    uploads, 
    uploadFile, 
    processFile, 
    deleteFile, 
    isUploading, 
    isProcessing, 
    isDeleting 
  } = useFileUpload();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        await uploadFile(file);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <Table className="w-5 h-5 text-green-500" />;
    if (type.includes('word')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes('image')) return <Image className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Loader className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcessFile = async (fileId: string) => {
    try {
      await processFile(fileId);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Upload Area */}
      <div className="card-body">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-4 text-center transition-all ${
            isDragActive ? 'border-primary bg-primary-light' : 'border-gray-300'
          }`}
          style={{
            minHeight: '120px',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f8f9ff' : '#f8f9fa'
          }}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={{ scale: isDragActive ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="w-8 h-8 text-muted mb-2" />
            <h5 className="mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h5>
            <p className="text-muted mb-2">
              or click to browse files
            </p>
            <small className="text-muted">
              Supports PDF, Excel, CSV, Word, and images (max 50MB)
            </small>
          </motion.div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        <div className="card-header">
          <h6 className="mb-0">Uploaded Files ({uploads.length})</h6>
        </div>
        
        <div className="p-3">
          <AnimatePresence>
            {uploads.length === 0 ? (
              <div className="text-center text-muted py-4">
                <File className="w-8 h-8 mb-2" />
                <p>No files uploaded yet</p>
                <small>Upload files to extract financial data automatically</small>
              </div>
            ) : (
              uploads.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card mb-2"
                >
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      {/* File Icon */}
                      <div className="mr-3">
                        {getFileIcon(file.type)}
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="mb-1">{file.name}</h6>
                          <div className="d-flex align-items-center">
                            {getStatusIcon(file.status)}
                          </div>
                        </div>
                        
                        <div className="text-muted text-sm">
                          {formatFileSize(file.size)} • {file.type.toUpperCase()}
                        </div>
                        
                        {file.error && (
                          <div className="text-danger text-sm mt-1">
                            {file.error}
                          </div>
                        )}
                        
                        {file.extractedData && file.extractedData.length > 0 && (
                          <div className="text-success text-sm mt-1">
                            Extracted {file.extractedData.length} data tables
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="d-flex align-items-center ml-3">
                        {file.status === 'completed' && (
                          <button
                            onClick={() => handleProcessFile(file.id)}
                            className="btn btn-sm btn-primary mr-2"
                            disabled={isProcessing}
                            title="Process file"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="btn btn-sm btn-outline-danger"
                          disabled={isDeleting}
                          title="Delete file"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tips */}
      <div className="card-footer">
        <div className="text-muted text-sm">
          <strong>💡 Tips:</strong>
          <ul className="mb-0 mt-1">
            <li>PDF financial statements are automatically parsed</li>
            <li>Excel files can be imported directly</li>
            <li>Images with tables are processed with OCR</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
