import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../database/connection';
import { FileProcessingService } from '../services/fileProcessingService';
import { APIResponse, FileUpload } from '@shared/types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = config.fileStorage.local.uploadPath;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.fileStorage.local.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.supportedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

export class FileController {
  private db = getDatabase();
  private fileProcessingService = new FileProcessingService();

  async upload(req: Request, res: Response) {
    try {
      const uploadMiddleware = upload.single('file');
      
      uploadMiddleware(req, res, async (err) => {
        if (err) {
          logger.error('File upload error:', err);
          return res.status(400).json({
            success: false,
            error: err.message,
            timestamp: new Date().toISOString(),
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No file uploaded',
            timestamp: new Date().toISOString(),
          });
        }

        try {
          // Save file record to database
          const fileUpload = await this.db.fileUpload.create({
            data: {
              id: uuidv4(),
              userId: req.user!.id,
              name: req.file.originalname,
              type: req.file.mimetype,
              size: req.file.size,
              filePath: req.file.path,
              status: 'UPLOADING',
            },
          });

          // Process file in background
          this.processFileAsync(fileUpload.id, req.file.path, req.file.originalname, req.file.mimetype);

          res.status(201).json({
            success: true,
            data: {
              id: fileUpload.id,
              name: fileUpload.name,
              type: fileUpload.type,
              size: fileUpload.size,
              status: fileUpload.status,
              uploadedAt: fileUpload.createdAt.toISOString(),
            },
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          logger.error('File upload database error:', error);
          res.status(500).json({
            success: false,
            error: 'Failed to save file record',
            timestamp: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      logger.error('File upload error:', error);
      res.status(500).json({
        success: false,
        error: 'File upload failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getUploads(req: Request, res: Response) {
    try {
      const uploads = await this.db.fileUpload.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
      });

      const response: FileUpload[] = uploads.map(upload => ({
        id: upload.id,
        name: upload.name,
        type: upload.type,
        size: upload.size,
        status: upload.status.toLowerCase() as any,
        extractedData: upload.extractedData as any,
        error: upload.error || undefined,
        uploadedAt: upload.createdAt.toISOString(),
      }));

      res.json({
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting uploads:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve uploads',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async process(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const fileUpload = await this.db.fileUpload.findUnique({
        where: { id, userId: req.user!.id },
      });

      if (!fileUpload) {
        return res.status(404).json({
          success: false,
          error: 'File not found',
          timestamp: new Date().toISOString(),
        });
      }

      if (!fileUpload.filePath) {
        return res.status(400).json({
          success: false,
          error: 'File path not available',
          timestamp: new Date().toISOString(),
        });
      }

      // Update status to processing
      await this.db.fileUpload.update({
        where: { id },
        data: { status: 'PROCESSING' },
      });

      // Process file
      await this.processFileAsync(id, fileUpload.filePath, fileUpload.name, fileUpload.type);

      res.json({
        success: true,
        message: 'File processing started',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error processing file:', error);
      res.status(500).json({
        success: false,
        error: 'File processing failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const fileUpload = await this.db.fileUpload.findUnique({
        where: { id, userId: req.user!.id },
      });

      if (!fileUpload) {
        return res.status(404).json({
          success: false,
          error: 'File not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Delete file from filesystem
      if (fileUpload.filePath && fs.existsSync(fileUpload.filePath)) {
        fs.unlinkSync(fileUpload.filePath);
      }

      // Delete from database
      await this.db.fileUpload.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'File deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error deleting file:', error);
      res.status(500).json({
        success: false,
        error: 'File deletion failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async processFileAsync(fileId: string, filePath: string, fileName: string, fileType: string): Promise<void> {
    try {
      logger.info(`Processing file: ${fileName}`);

      // Process the file
      const processedFile = await this.fileProcessingService.processFile(filePath, fileName, fileType);

      // Update database with results
      await this.db.fileUpload.update({
        where: { id: fileId },
        data: {
          status: 'COMPLETED',
          extractedData: processedFile.extractedData,
          metadata: processedFile.metadata,
        },
      });

      logger.info(`File processing completed: ${fileName}`, {
        tablesExtracted: processedFile.extractedData.length,
      });
    } catch (error) {
      logger.error(`File processing failed: ${fileName}`, error);
      
      // Update database with error
      await this.db.fileUpload.update({
        where: { id: fileId },
        data: {
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}
