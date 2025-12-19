import { getDatabase } from '../database/connection';
import { logger } from '../utils/logger';
import { LLMService } from './llmService';
import { CVStatus, Industry } from '@prisma/client';

export class CVReviewService {
  private prisma = getDatabase();
  private llmService = new LLMService();

  /**
   * Create a new CV
   */
  async createCV(studentId: string, data: {
    title: string;
    content: any;
    fileUrl?: string;
  }) {
    try {
      // If this is the first CV or marked as primary, set it as primary
      const existingCVs = await this.prisma.cV.count({
        where: { studentId },
      });

      const cv = await this.prisma.cV.create({
        data: {
          studentId,
          title: data.title,
          content: data.content,
          fileUrl: data.fileUrl,
          isPrimary: existingCVs === 0,
          status: CVStatus.DRAFT,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      logger.info(`CV ${cv.id} created for student ${studentId}`);
      return cv;
    } catch (error) {
      logger.error('Error creating CV:', error);
      throw error;
    }
  }

  /**
   * Get student's CVs
   */
  async getStudentCVs(studentId: string) {
    try {
      const cvs = await this.prisma.cV.findMany({
        where: { studentId },
        orderBy: [
          { isPrimary: 'desc' },
          { updatedAt: 'desc' },
        ],
      });

      return cvs;
    } catch (error) {
      logger.error('Error getting student CVs:', error);
      throw error;
    }
  }

  /**
   * Get a specific CV
   */
  async getCV(cvId: string, studentId?: string) {
    try {
      const where: any = { id: cvId };
      if (studentId) {
        where.studentId = studentId;
      }

      const cv = await this.prisma.cV.findUnique({
        where,
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return cv;
    } catch (error) {
      logger.error('Error getting CV:', error);
      throw error;
    }
  }

  /**
   * Update CV
   */
  async updateCV(cvId: string, studentId: string, data: {
    title?: string;
    content?: any;
    fileUrl?: string;
  }) {
    try {
      const cv = await this.prisma.cV.findUnique({
        where: { id: cvId },
      });

      if (!cv || cv.studentId !== studentId) {
        throw new Error('CV not found or unauthorized');
      }

      const updated = await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          ...data,
          status: CVStatus.DRAFT, // Reset to draft when updated
          updatedAt: new Date(),
        },
      });

      logger.info(`CV ${cvId} updated`);
      return updated;
    } catch (error) {
      logger.error('Error updating CV:', error);
      throw error;
    }
  }

  /**
   * Set primary CV
   */
  async setPrimaryCV(cvId: string, studentId: string) {
    try {
      // Unset all other primary CVs
      await this.prisma.cV.updateMany({
        where: {
          studentId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });

      // Set this CV as primary
      const cv = await this.prisma.cV.update({
        where: {
          id: cvId,
          studentId,
        },
        data: {
          isPrimary: true,
        },
      });

      logger.info(`CV ${cvId} set as primary`);
      return cv;
    } catch (error) {
      logger.error('Error setting primary CV:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered CV review
   */
  async getAIReview(cvId: string, studentId: string, options?: {
    targetIndustry?: Industry;
    targetRole?: string;
    company?: string;
  }) {
    try {
      const cv = await this.prisma.cV.findUnique({
        where: { id: cvId, studentId },
        include: {
          student: true,
        },
      });

      if (!cv) {
        throw new Error('CV not found');
      }

      // Build prompt for AI review
      const prompt = this.buildReviewPrompt(cv, options);

      const review = await this.llmService.generateResponse({
        userMessage: prompt,
        context: {
          cvId,
          studentId,
          targetIndustry: options?.targetIndustry,
          targetRole: options?.targetRole,
        },
      });

      // Parse AI response into structured feedback
      const feedback = this.parseReviewResponse(review.content);

      // Calculate score
      const score = this.calculateCVScore(feedback);

      // Update CV with feedback
      const updated = await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          aiFeedback: feedback,
          score,
          lastReviewedAt: new Date(),
          status: CVStatus.UNDER_REVIEW,
        },
      });

      logger.info(`AI review completed for CV ${cvId}`);
      return updated;
    } catch (error) {
      logger.error('Error getting AI review:', error);
      throw error;
    }
  }

  /**
   * Build prompt for CV review
   */
  private buildReviewPrompt(cv: any, options?: {
    targetIndustry?: Industry;
    targetRole?: string;
    company?: string;
  }): string {
    let prompt = `Please provide a comprehensive review of this CV/resume. Analyze the following aspects:\n\n`;
    prompt += `CV Content:\n${JSON.stringify(cv.content, null, 2)}\n\n`;

    if (options?.targetIndustry) {
      prompt += `Target Industry: ${options.targetIndustry}\n`;
    }
    if (options?.targetRole) {
      prompt += `Target Role: ${options.targetRole}\n`;
    }
    if (options?.company) {
      prompt += `Target Company: ${options.company}\n`;
    }

    prompt += `\nPlease provide feedback in the following format:\n`;
    prompt += `1. Overall Assessment (score out of 100)\n`;
    prompt += `2. Strengths (list 3-5 key strengths)\n`;
    prompt += `3. Areas for Improvement (list 3-5 areas)\n`;
    prompt += `4. Specific Recommendations (actionable suggestions)\n`;
    prompt += `5. Industry/Role Fit (how well it matches the target)\n`;
    prompt += `6. Formatting and Presentation (layout, design, readability)\n`;
    prompt += `7. Content Quality (clarity, impact, relevance)\n`;
    prompt += `8. Missing Elements (what should be added)\n`;

    return prompt;
  }

  /**
   * Parse AI response into structured feedback
   */
  private parseReviewResponse(content: string): any {
    try {
      // Try to extract structured data from AI response
      const feedback: any = {
        overallAssessment: '',
        score: 0,
        strengths: [],
        improvements: [],
        recommendations: [],
        industryFit: '',
        formatting: '',
        contentQuality: '',
        missingElements: [],
        rawFeedback: content,
      };

      // Extract score (look for numbers 0-100)
      const scoreMatch = content.match(/(\d+)\s*(?:out of 100|/100|%)/i);
      if (scoreMatch) {
        feedback.score = parseInt(scoreMatch[1]);
      }

      // Extract strengths
      const strengthsMatch = content.match(/strengths?[:\-]?\s*(.*?)(?=\n\n|\n\d+\.|improvements?|areas for improvement)/is);
      if (strengthsMatch) {
        feedback.strengths = strengthsMatch[1]
          .split(/[•\-\*]/)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 5);
      }

      // Extract improvements
      const improvementsMatch = content.match(/(?:improvements?|areas for improvement)[:\-]?\s*(.*?)(?=\n\n|\n\d+\.|recommendations?)/is);
      if (improvementsMatch) {
        feedback.improvements = improvementsMatch[1]
          .split(/[•\-\*]/)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 5);
      }

      // Extract recommendations
      const recommendationsMatch = content.match(/(?:recommendations?|suggestions?)[:\-]?\s*(.*?)(?=\n\n|\n\d+\.|industry|formatting)/is);
      if (recommendationsMatch) {
        feedback.recommendations = recommendationsMatch[1]
          .split(/[•\-\*]/)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 5);
      }

      return feedback;
    } catch (error) {
      logger.error('Error parsing review response:', error);
      return {
        rawFeedback: content,
        score: 0,
        strengths: [],
        improvements: [],
        recommendations: [],
      };
    }
  }

  /**
   * Calculate CV score based on feedback
   */
  private calculateCVScore(feedback: any): number {
    let score = feedback.score || 0;

    // Adjust score based on feedback quality
    if (feedback.strengths && feedback.strengths.length >= 3) {
      score += 5;
    }
    if (feedback.improvements && feedback.improvements.length === 0) {
      score += 10; // No improvements needed is good
    } else if (feedback.improvements && feedback.improvements.length <= 2) {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Add mentor feedback to CV
   */
  async addMentorFeedback(cvId: string, mentorId: string, feedback: {
    strengths?: string[];
    improvements?: string[];
    recommendations?: string[];
    overallComments?: string;
    score?: number;
  }) {
    try {
      const cv = await this.prisma.cV.findUnique({
        where: { id: cvId },
      });

      if (!cv) {
        throw new Error('CV not found');
      }

      const existingFeedback = (cv.mentorFeedback as any) || {};
      const updatedFeedback = {
        ...existingFeedback,
        [mentorId]: {
          ...feedback,
          reviewedAt: new Date().toISOString(),
        },
      };

      const updated = await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          mentorFeedback: updatedFeedback,
          score: feedback.score || cv.score,
          lastReviewedAt: new Date(),
          status: CVStatus.UNDER_REVIEW,
        },
      });

      logger.info(`Mentor feedback added to CV ${cvId}`);
      return updated;
    } catch (error) {
      logger.error('Error adding mentor feedback:', error);
      throw error;
    }
  }

  /**
   * Approve CV
   */
  async approveCV(cvId: string, studentId: string) {
    try {
      const cv = await this.prisma.cV.update({
        where: {
          id: cvId,
          studentId,
        },
        data: {
          status: CVStatus.APPROVED,
        },
      });

      logger.info(`CV ${cvId} approved`);
      return cv;
    } catch (error) {
      logger.error('Error approving CV:', error);
      throw error;
    }
  }

  /**
   * Delete CV
   */
  async deleteCV(cvId: string, studentId: string) {
    try {
      const cv = await this.prisma.cV.findUnique({
        where: { id: cvId },
      });

      if (!cv || cv.studentId !== studentId) {
        throw new Error('CV not found or unauthorized');
      }

      await this.prisma.cV.delete({
        where: { id: cvId },
      });

      logger.info(`CV ${cvId} deleted`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting CV:', error);
      throw error;
    }
  }
}

export const cvReviewService = new CVReviewService();

