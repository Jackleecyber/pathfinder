import { Request } from 'express';
import { cvReviewService } from '../services/cvReviewService';
import { mentorshipService } from '../services/mentorshipService';
import { APIResponse } from '@shared/types';
import { logger } from '../utils/logger';

export class CVController {
  /**
   * Create CV
   */
  async createCV(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const cv = await cvReviewService.createCV(studentProfile.id, req.body);

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error creating CV:', error);
      return {
        success: false,
        error: error.message || 'Failed to create CV',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get student's CVs
   */
  async getStudentCVs(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const cvs = await cvReviewService.getStudentCVs(studentProfile.id);

      return {
        success: true,
        data: cvs,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting CVs:', error);
      return {
        success: false,
        error: error.message || 'Failed to get CVs',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get specific CV
   */
  async getCV(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      const cv = await cvReviewService.getCV(cvId, studentProfile?.id);

      if (!cv) {
        return {
          success: false,
          error: 'CV not found',
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting CV:', error);
      return {
        success: false,
        error: error.message || 'Failed to get CV',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Update CV
   */
  async updateCV(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const cv = await cvReviewService.updateCV(cvId, studentProfile.id, req.body);

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error updating CV:', error);
      return {
        success: false,
        error: error.message || 'Failed to update CV',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Set primary CV
   */
  async setPrimaryCV(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const cv = await cvReviewService.setPrimaryCV(cvId, studentProfile.id);

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error setting primary CV:', error);
      return {
        success: false,
        error: error.message || 'Failed to set primary CV',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get AI review
   */
  async getAIReview(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const cv = await cvReviewService.getAIReview(cvId, studentProfile.id, req.body);

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting AI review:', error);
      return {
        success: false,
        error: error.message || 'Failed to get AI review',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Add mentor feedback
   */
  async addMentorFeedback(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const mentorProfile = await mentorshipService.getMentorProfile(userId);
      if (!mentorProfile) {
        throw new Error('Mentor profile not found');
      }

      const cv = await cvReviewService.addMentorFeedback(cvId, mentorProfile.id, req.body);

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error adding mentor feedback:', error);
      return {
        success: false,
        error: error.message || 'Failed to add mentor feedback',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Approve CV
   */
  async approveCV(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const cv = await cvReviewService.approveCV(cvId, studentProfile.id);

      return {
        success: true,
        data: cv,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error approving CV:', error);
      return {
        success: false,
        error: error.message || 'Failed to approve CV',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Delete CV
   */
  async deleteCV(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { cvId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const result = await cvReviewService.deleteCV(cvId, studentProfile.id);

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error deleting CV:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete CV',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const cvController = new CVController();

