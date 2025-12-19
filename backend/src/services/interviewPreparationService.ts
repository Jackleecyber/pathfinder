import { getDatabase } from '../database/connection';
import { logger } from '../utils/logger';
import { Industry, QuestionType, Difficulty } from '@prisma/client';

export class InterviewPreparationService {
  private prisma = getDatabase();

  /**
   * Get interview questions from the question bank
   */
  async getQuestions(filters?: {
    type?: QuestionType;
    industry?: Industry;
    category?: string;
    difficulty?: Difficulty;
    limit?: number;
    offset?: number;
  }) {
    try {
      const where: any = {};

      if (filters?.type) {
        where.type = filters.type;
      }
      if (filters?.industry) {
        where.industry = filters.industry;
      }
      if (filters?.category) {
        where.category = filters.category;
      }
      if (filters?.difficulty) {
        where.difficulty = filters.difficulty;
      }

      const questions = await this.prisma.interviewQuestion.findMany({
        where,
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { isVerified: 'desc' },
          { usageCount: 'desc' },
          { createdAt: 'desc' },
        ],
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });

      return questions;
    } catch (error) {
      logger.error('Error getting interview questions:', error);
      throw error;
    }
  }

  /**
   * Create a new interview question
   */
  async createQuestion(mentorId: string, data: {
    type: QuestionType;
    category: string;
    industry?: Industry;
    difficulty: Difficulty;
    question: string;
    expectedAnswer?: string;
    tips?: string[];
    keywords?: string[];
  }) {
    try {
      const question = await this.prisma.interviewQuestion.create({
        data: {
          mentorId,
          ...data,
        },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      logger.info(`Interview question ${question.id} created by mentor ${mentorId}`);
      return question;
    } catch (error) {
      logger.error('Error creating interview question:', error);
      throw error;
    }
  }

  /**
   * Get a practice question set
   */
  async getPracticeSet(options: {
    type?: QuestionType;
    industry?: Industry;
    difficulty?: Difficulty;
    count?: number;
  }) {
    try {
      const where: any = {};

      if (options.type) {
        where.type = options.type;
      }
      if (options.industry) {
        where.industry = options.industry;
      }
      if (options.difficulty) {
        where.difficulty = options.difficulty;
      }

      const questions = await this.prisma.interviewQuestion.findMany({
        where,
        orderBy: {
          usageCount: 'asc', // Prefer less-used questions for variety
        },
        take: options.count || 10,
      });

      // Increment usage count
      await Promise.all(
        questions.map(q =>
          this.prisma.interviewQuestion.update({
            where: { id: q.id },
            data: { usageCount: { increment: 1 } },
          })
        )
      );

      return questions;
    } catch (error) {
      logger.error('Error getting practice set:', error);
      throw error;
    }
  }

  /**
   * Get question by ID
   */
  async getQuestion(questionId: string) {
    try {
      const question = await this.prisma.interviewQuestion.findUnique({
        where: { id: questionId },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return question;
    } catch (error) {
      logger.error('Error getting question:', error);
      throw error;
    }
  }

  /**
   * Update question
   */
  async updateQuestion(questionId: string, mentorId: string, data: {
    question?: string;
    expectedAnswer?: string;
    tips?: string[];
    keywords?: string[];
    difficulty?: Difficulty;
    isVerified?: boolean;
  }) {
    try {
      const question = await this.prisma.interviewQuestion.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        throw new Error('Question not found');
      }

      // Only the creator or admin can update
      if (question.mentorId !== mentorId) {
        throw new Error('Unauthorized to update this question');
      }

      const updated = await this.prisma.interviewQuestion.update({
        where: { id: questionId },
        data,
      });

      logger.info(`Question ${questionId} updated`);
      return updated;
    } catch (error) {
      logger.error('Error updating question:', error);
      throw error;
    }
  }

  /**
   * Verify a question (admin/mentor action)
   */
  async verifyQuestion(questionId: string) {
    try {
      const question = await this.prisma.interviewQuestion.update({
        where: { id: questionId },
        data: { isVerified: true },
      });

      logger.info(`Question ${questionId} verified`);
      return question;
    } catch (error) {
      logger.error('Error verifying question:', error);
      throw error;
    }
  }

  /**
   * Get question statistics
   */
  async getQuestionStats() {
    try {
      const stats = await this.prisma.interviewQuestion.groupBy({
        by: ['type', 'industry', 'difficulty'],
        _count: {
          id: true,
        },
      });

      const total = await this.prisma.interviewQuestion.count();
      const verified = await this.prisma.interviewQuestion.count({
        where: { isVerified: true },
      });

      return {
        total,
        verified,
        byType: stats.filter(s => s.type),
        byIndustry: stats.filter(s => s.industry),
        byDifficulty: stats.filter(s => s.difficulty),
      };
    } catch (error) {
      logger.error('Error getting question stats:', error);
      throw error;
    }
  }

  /**
   * Get recommended questions for a student
   */
  async getRecommendedQuestions(studentId: string, options?: {
    count?: number;
  }) {
    try {
      const student = await this.prisma.studentProfile.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new Error('Student profile not found');
      }

      const where: any = {
        isVerified: true,
      };

      if (student.targetIndustry && student.targetIndustry.length > 0) {
        where.industry = { in: student.targetIndustry };
      }

      const questions = await this.prisma.interviewQuestion.findMany({
        where,
        orderBy: [
          { usageCount: 'asc' },
          { createdAt: 'desc' },
        ],
        take: options?.count || 20,
      });

      return questions;
    } catch (error) {
      logger.error('Error getting recommended questions:', error);
      throw error;
    }
  }

  /**
   * Search questions
   */
  async searchQuestions(query: string, filters?: {
    type?: QuestionType;
    industry?: Industry;
    difficulty?: Difficulty;
    limit?: number;
  }) {
    try {
      const where: any = {
        OR: [
          { question: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { keywords: { hasSome: [query] } },
        ],
      };

      if (filters?.type) {
        where.type = filters.type;
      }
      if (filters?.industry) {
        where.industry = filters.industry;
      }
      if (filters?.difficulty) {
        where.difficulty = filters.difficulty;
      }

      const questions = await this.prisma.interviewQuestion.findMany({
        where,
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { isVerified: 'desc' },
          { usageCount: 'desc' },
        ],
        take: filters?.limit || 50,
      });

      return questions;
    } catch (error) {
      logger.error('Error searching questions:', error);
      throw error;
    }
  }
}

export const interviewPreparationService = new InterviewPreparationService();

