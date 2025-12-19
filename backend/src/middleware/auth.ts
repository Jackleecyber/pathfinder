import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { getDatabase } from '../database/connection';
import { logger } from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        timestamp: new Date().toISOString()
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.security.jwtSecret) as any;
    
    // Check if session exists and is valid
    const db = getDatabase();
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
        timestamp: new Date().toISOString()
      });
    }

    if (!session.user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User account is inactive',
        timestamp: new Date().toISOString()
      });
    }

    // Add user to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      timestamp: new Date().toISOString()
    });
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const decoded = jwt.verify(token, config.security.jwtSecret) as any;
      
      const db = getDatabase();
      const session = await db.session.findUnique({
        where: { token },
        include: { user: true }
      });

      if (session && session.expiresAt > new Date() && session.user.isActive) {
        req.user = {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      timestamp: new Date().toISOString()
    });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

export const superAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      timestamp: new Date().toISOString()
    });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Super admin access required',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check query parameter
  if (req.query.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    config.security.jwtSecret,
    { expiresIn: config.security.jwtExpiresIn }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.security.jwtSecret);
};
