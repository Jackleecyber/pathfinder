import { Request } from 'express';
import { mentorshipService } from '../services/mentorshipService';
import { APIResponse } from '@shared/types';
import { logger } from '../utils/logger';

export class MentorshipController {
  /**
   * Create or update student profile
   */
  async createOrUpdateStudentProfile(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const profile = await mentorshipService.createOrUpdateStudentProfile(userId, req.body);

      return {
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error creating/updating student profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to create/update student profile',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create or update mentor profile
   */
  async createOrUpdateMentorProfile(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const profile = await mentorshipService.createOrUpdateMentorProfile(userId, req.body);

      return {
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error creating/updating mentor profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to create/update mentor profile',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get student profile
   */
  async getStudentProfile(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const profile = await mentorshipService.getStudentProfile(userId);

      if (!profile) {
        return {
          success: false,
          error: 'Student profile not found',
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting student profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to get student profile',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get mentor profile
   */
  async getMentorProfile(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const profile = await mentorshipService.getMentorProfile(userId);

      if (!profile) {
        return {
          success: false,
          error: 'Mentor profile not found',
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting mentor profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to get mentor profile',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Find matching mentors
   */
  async findMatchingMentors(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      // Get student profile to find studentId
      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found. Please create your profile first.');
      }

      const mentors = await mentorshipService.findMatchingMentors(studentProfile.id, {
        industries: req.query.industries as any,
        mentorTypes: req.query.mentorTypes as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      return {
        success: true,
        data: mentors,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error finding matching mentors:', error);
      return {
        success: false,
        error: error.message || 'Failed to find matching mentors',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Schedule mentorship session
   */
  async scheduleSession(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      // Get student profile
      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const session = await mentorshipService.scheduleSession({
        studentId: studentProfile.id,
        ...req.body,
        scheduledAt: new Date(req.body.scheduledAt),
      });

      return {
        success: true,
        data: session,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error scheduling session:', error);
      return {
        success: false,
        error: error.message || 'Failed to schedule session',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get student sessions
   */
  async getStudentSessions(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const sessions = await mentorshipService.getStudentSessions(studentProfile.id, {
        status: req.query.status as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      });

      return {
        success: true,
        data: sessions,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting student sessions:', error);
      return {
        success: false,
        error: error.message || 'Failed to get sessions',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get mentor sessions
   */
  async getMentorSessions(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const mentorProfile = await mentorshipService.getMentorProfile(userId);
      if (!mentorProfile) {
        throw new Error('Mentor profile not found');
      }

      const sessions = await mentorshipService.getMentorSessions(mentorProfile.id, {
        status: req.query.status as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      });

      return {
        success: true,
        data: sessions,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting mentor sessions:', error);
      return {
        success: false,
        error: error.message || 'Failed to get sessions',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Update session status
   */
  async updateSessionStatus(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { sessionId } = req.params;
      const { status } = req.body;

      const session = await mentorshipService.updateSessionStatus(sessionId, status, userId);

      return {
        success: true,
        data: session,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error updating session status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update session status',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Add session feedback
   */
  async addSessionFeedback(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { sessionId } = req.params;

      const session = await mentorshipService.addSessionFeedback(sessionId, req.body, userId);

      return {
        success: true,
        data: session,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error adding session feedback:', error);
      return {
        success: false,
        error: error.message || 'Failed to add feedback',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const mentorshipController = new MentorshipController();

