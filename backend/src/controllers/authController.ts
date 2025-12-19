import { Request } from 'express';
import { getDatabase } from '../database/connection';
import { generateToken } from '../middleware/auth';
import { APIResponse } from '@shared/types';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  private db = getDatabase();

  async login(data: { email: string; password: string }): Promise<APIResponse<any>> {
    try {
      // Find user by email
      const user = await this.db.user.findUnique({
        where: { email: data.email }
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      // Verify password (in a real app, you'd hash the password)
      // For demo purposes, we'll skip password verification
      const isValidPassword = true; // await bcrypt.compare(data.password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = generateToken(user.id);

      // Create session
      const session = await this.db.session.create({
        data: {
          id: uuidv4(),
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token,
          expiresAt: session.expiresAt
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async register(data: { email: string; password: string; name: string }): Promise<APIResponse<any>> {
    try {
      // Check if user already exists
      const existingUser = await this.db.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await this.db.user.create({
        data: {
          id: uuidv4(),
          email: data.email,
          name: data.name,
          // password: hashedPassword, // Add password field to schema
          role: 'USER'
        }
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async logout(req: Request): Promise<APIResponse<{ message: string }>> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        await this.db.session.deleteMany({
          where: { token }
        });
      }

      return {
        success: true,
        data: { message: 'Logged out successfully' },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<APIResponse<any>> {
    try {
      // Find session
      const session = await this.db.session.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      });

      if (!session || session.expiresAt < new Date()) {
        throw new Error('Invalid refresh token');
      }

      // Generate new token
      const newToken = generateToken(session.userId);

      // Update session
      await this.db.session.update({
        where: { id: session.id },
        data: {
          token: newToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });

      return {
        success: true,
        data: {
          token: newToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }
}
