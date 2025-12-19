import { Request } from 'express';
import { mockInterviewService } from '../services/mockInterviewService';
import { interviewPreparationService } from '../services/interviewPreparationService';
import { mentorshipService } from '../services/mentorshipService';
import { APIResponse } from '@shared/types';
import { logger } from '../utils/logger';

export class InterviewController {
  /**
   * Get interview questions
   */
  async getQuestions(req: Request): Promise<APIResponse<any>> {
    try {
      const questions = await interviewPreparationService.getQuestions({
        type: req.query.type as any,
        industry: req.query.industry as any,
        category: req.query.category as string,
        difficulty: req.query.difficulty as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      });

      return {
        success: true,
        data: questions,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting questions:', error);
      return {
        success: false,
        error: error.message || 'Failed to get questions',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create interview question
   */
  async createQuestion(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const mentorProfile = await mentorshipService.getMentorProfile(userId);
      if (!mentorProfile) {
        throw new Error('Mentor profile not found');
      }

      const question = await interviewPreparationService.createQuestion(mentorProfile.id, req.body);

      return {
        success: true,
        data: question,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error creating question:', error);
      return {
        success: false,
        error: error.message || 'Failed to create question',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get practice set
   */
  async getPracticeSet(req: Request): Promise<APIResponse<any>> {
    try {
      const questions = await interviewPreparationService.getPracticeSet({
        type: req.query.type as any,
        industry: req.query.industry as any,
        difficulty: req.query.difficulty as any,
        count: req.query.count ? parseInt(req.query.count as string) : undefined,
      });

      return {
        success: true,
        data: questions,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting practice set:', error);
      return {
        success: false,
        error: error.message || 'Failed to get practice set',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get recommended questions
   */
  async getRecommendedQuestions(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const questions = await interviewPreparationService.getRecommendedQuestions(studentProfile.id, {
        count: req.query.count ? parseInt(req.query.count as string) : undefined,
      });

      return {
        success: true,
        data: questions,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting recommended questions:', error);
      return {
        success: false,
        error: error.message || 'Failed to get recommended questions',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Search questions
   */
  async searchQuestions(req: Request): Promise<APIResponse<any>> {
    try {
      const { query } = req.query;
      if (!query) {
        throw new Error('Search query is required');
      }

      const questions = await interviewPreparationService.searchQuestions(query as string, {
        type: req.query.type as any,
        industry: req.query.industry as any,
        difficulty: req.query.difficulty as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      return {
        success: true,
        data: questions,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error searching questions:', error);
      return {
        success: false,
        error: error.message || 'Failed to search questions',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Schedule mock interview
   */
  async scheduleMockInterview(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const interview = await mockInterviewService.scheduleMockInterview({
        studentId: studentProfile.id,
        ...req.body,
        scheduledAt: new Date(req.body.scheduledAt),
      });

      return {
        success: true,
        data: interview,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error scheduling mock interview:', error);
      return {
        success: false,
        error: error.message || 'Failed to schedule mock interview',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Start mock interview
   */
  async startMockInterview(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { interviewId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const interview = await mockInterviewService.startMockInterview(interviewId, studentProfile.id);

      return {
        success: true,
        data: interview,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error starting mock interview:', error);
      return {
        success: false,
        error: error.message || 'Failed to start mock interview',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Submit answer
   */
  async submitAnswer(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { interviewId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const interview = await mockInterviewService.submitAnswer(interviewId, studentProfile.id, req.body);

      return {
        success: true,
        data: interview,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error submitting answer:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit answer',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Complete mock interview
   */
  async completeMockInterview(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { interviewId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const interview = await mockInterviewService.completeMockInterview(
        interviewId,
        studentProfile.id,
        req.body.recordingUrl
      );

      return {
        success: true,
        data: interview,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error completing mock interview:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete mock interview',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get student's mock interviews
   */
  async getStudentInterviews(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      if (!studentProfile) {
        throw new Error('Student profile not found');
      }

      const interviews = await mockInterviewService.getStudentInterviews(studentProfile.id, {
        status: req.query.status as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      });

      return {
        success: true,
        data: interviews,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting student interviews:', error);
      return {
        success: false,
        error: error.message || 'Failed to get interviews',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get mock interview
   */
  async getMockInterview(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { interviewId } = req.params;

      const studentProfile = await mentorshipService.getStudentProfile(userId);
      const interview = await mockInterviewService.getMockInterview(interviewId, studentProfile?.id);

      if (!interview) {
        return {
          success: false,
          error: 'Mock interview not found',
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: interview,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error getting mock interview:', error);
      return {
        success: false,
        error: error.message || 'Failed to get mock interview',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Cancel mock interview
   */
  async cancelMockInterview(req: Request): Promise<APIResponse<any>> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      const { interviewId } = req.params;

      const interview = await mockInterviewService.cancelMockInterview(interviewId, userId);

      return {
        success: true,
        data: interview,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Error cancelling mock interview:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel mock interview',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const interviewController = new InterviewController();

