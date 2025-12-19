import { getDatabase } from '../database/connection';
import { logger } from '../utils/logger';
import { LLMService } from './llmService';
import { InterviewType, InterviewStatus, Industry } from '@prisma/client';

export class MockInterviewService {
  private prisma = getDatabase();
  private llmService = new LLMService();

  /**
   * Schedule a mock interview
   */
  async scheduleMockInterview(data: {
    studentId: string;
    mentorId?: string;
    title: string;
    type: InterviewType;
    industry?: Industry;
    company?: string;
    role?: string;
    scheduledAt: Date;
  }) {
    try {
      const interview = await this.prisma.mockInterview.create({
        data: {
          ...data,
          status: InterviewStatus.SCHEDULED,
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
          mentor: {
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

      logger.info(`Mock interview ${interview.id} scheduled`);
      return interview;
    } catch (error) {
      logger.error('Error scheduling mock interview:', error);
      throw error;
    }
  }

  /**
   * Start a mock interview
   */
  async startMockInterview(interviewId: string, studentId: string) {
    try {
      const interview = await this.prisma.mockInterview.findUnique({
        where: { id: interviewId },
      });

      if (!interview) {
        throw new Error('Mock interview not found');
      }

      if (interview.studentId !== studentId) {
        throw new Error('Unauthorized to start this interview');
      }

      if (interview.status !== InterviewStatus.SCHEDULED) {
        throw new Error('Interview is not in scheduled status');
      }

      // Generate questions if not already set
      let questions = interview.questions as any;
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        questions = await this.generateQuestions(interview);
      }

      const updated = await this.prisma.mockInterview.update({
        where: { id: interviewId },
        data: {
          status: InterviewStatus.IN_PROGRESS,
          startedAt: new Date(),
          questions,
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
          mentor: {
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

      logger.info(`Mock interview ${interviewId} started`);
      return updated;
    } catch (error) {
      logger.error('Error starting mock interview:', error);
      throw error;
    }
  }

  /**
   * Generate interview questions based on interview type and industry
   */
  private async generateQuestions(interview: any): Promise<any[]> {
    try {
      const { interviewPreparationService } = await import('./interviewPreparationService');
      const service = interviewPreparationService;

      const filters: any = {
        type: interview.type === InterviewType.MIXED ? undefined : interview.type,
        industry: interview.industry,
        count: 10,
      };

      // Get questions from question bank
      const questions = await service.getPracticeSet(filters);

      // If we have a mentor, they might have specific questions
      // For now, we'll use the question bank
      return questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        difficulty: q.difficulty,
        expectedAnswer: q.expectedAnswer,
        tips: q.tips,
      }));
    } catch (error) {
      logger.error('Error generating questions:', error);
      // Return default questions if question bank fails
      return this.getDefaultQuestions(interview.type);
    }
  }

  /**
   * Get default questions if question bank is unavailable
   */
  private getDefaultQuestions(type: InterviewType): any[] {
    const defaultQuestions: Record<InterviewType, any[]> = {
      [InterviewType.BEHAVIORAL]: [
        {
          id: 'default-1',
          question: 'Tell me about yourself.',
          type: 'BEHAVIORAL',
          difficulty: 'EASY',
        },
        {
          id: 'default-2',
          question: 'Why are you interested in this role?',
          type: 'BEHAVIORAL',
          difficulty: 'EASY',
        },
        {
          id: 'default-3',
          question: 'Describe a time when you faced a challenging situation.',
          type: 'BEHAVIORAL',
          difficulty: 'MEDIUM',
        },
      ],
      [InterviewType.TECHNICAL]: [
        {
          id: 'default-4',
          question: 'Explain a technical concept you are passionate about.',
          type: 'TECHNICAL',
          difficulty: 'MEDIUM',
        },
      ],
      [InterviewType.CASE_STUDY]: [
        {
          id: 'default-5',
          question: 'How would you approach solving a business problem?',
          type: 'CASE_STUDY',
          difficulty: 'HARD',
        },
      ],
      [InterviewType.SYSTEM_DESIGN]: [
        {
          id: 'default-6',
          question: 'Design a system for a given requirement.',
          type: 'SYSTEM_DESIGN',
          difficulty: 'HARD',
        },
      ],
      [InterviewType.MIXED]: [
        {
          id: 'default-7',
          question: 'Tell me about yourself.',
          type: 'BEHAVIORAL',
          difficulty: 'EASY',
        },
        {
          id: 'default-8',
          question: 'Explain a technical concept.',
          type: 'TECHNICAL',
          difficulty: 'MEDIUM',
        },
      ],
    };

    return defaultQuestions[type] || defaultQuestions[InterviewType.MIXED];
  }

  /**
   * Submit answer for a question
   */
  async submitAnswer(interviewId: string, studentId: string, data: {
    questionId: string;
    answer: string;
    timestamp?: number;
  }) {
    try {
      const interview = await this.prisma.mockInterview.findUnique({
        where: { id: interviewId },
      });

      if (!interview) {
        throw new Error('Mock interview not found');
      }

      if (interview.studentId !== studentId) {
        throw new Error('Unauthorized to submit answer');
      }

      if (interview.status !== InterviewStatus.IN_PROGRESS) {
        throw new Error('Interview is not in progress');
      }

      const studentAnswers = (interview.studentAnswers as any) || {};
      studentAnswers[data.questionId] = {
        answer: data.answer,
        timestamp: data.timestamp || Date.now(),
        submittedAt: new Date().toISOString(),
      };

      const updated = await this.prisma.mockInterview.update({
        where: { id: interviewId },
        data: {
          studentAnswers,
        },
      });

      logger.info(`Answer submitted for question ${data.questionId} in interview ${interviewId}`);
      return updated;
    } catch (error) {
      logger.error('Error submitting answer:', error);
      throw error;
    }
  }

  /**
   * Complete mock interview
   */
  async completeMockInterview(interviewId: string, studentId: string, recordingUrl?: string) {
    try {
      const interview = await this.prisma.mockInterview.findUnique({
        where: { id: interviewId },
      });

      if (!interview) {
        throw new Error('Mock interview not found');
      }

      if (interview.studentId !== studentId) {
        throw new Error('Unauthorized to complete this interview');
      }

      if (interview.status !== InterviewStatus.IN_PROGRESS) {
        throw new Error('Interview is not in progress');
      }

      const startedAt = interview.startedAt || new Date();
      const completedAt = new Date();
      const duration = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000 / 60);

      // Generate AI feedback
      const feedback = await this.generateFeedback(interview);

      const updated = await this.prisma.mockInterview.update({
        where: { id: interviewId },
        data: {
          status: InterviewStatus.COMPLETED,
          completedAt,
          duration,
          recordingUrl,
          feedback,
          score: feedback.overallScore,
          strengths: feedback.strengths || [],
          improvements: feedback.improvements || [],
        },
      });

      logger.info(`Mock interview ${interviewId} completed`);
      return updated;
    } catch (error) {
      logger.error('Error completing mock interview:', error);
      throw error;
    }
  }

  /**
   * Generate AI feedback for mock interview
   */
  private async generateFeedback(interview: any): Promise<any> {
    try {
      const questions = interview.questions as any[];
      const answers = interview.studentAnswers as any;

      if (!questions || !answers) {
        return {
          overallScore: 0,
          strengths: [],
          improvements: [],
          feedback: 'No answers provided',
        };
      }

      // Build prompt for AI feedback
      const prompt = this.buildFeedbackPrompt(questions, answers, interview);

      const response = await this.llmService.generateResponse({
        userMessage: prompt,
        context: {
          interviewId: interview.id,
          type: interview.type,
          industry: interview.industry,
        },
      });

      // Parse feedback
      const feedback = this.parseFeedbackResponse(response.content);

      return feedback;
    } catch (error) {
      logger.error('Error generating feedback:', error);
      return {
        overallScore: 0,
        strengths: ['Completed the interview'],
        improvements: ['Review your answers for improvement'],
        feedback: 'Feedback generation failed. Please review your answers manually.',
      };
    }
  }

  /**
   * Build prompt for AI feedback
   */
  private buildFeedbackPrompt(questions: any[], answers: any, interview: any): string {
    let prompt = `Please provide comprehensive feedback on this mock interview.\n\n`;
    prompt += `Interview Type: ${interview.type}\n`;
    if (interview.industry) prompt += `Industry: ${interview.industry}\n`;
    if (interview.company) prompt += `Company: ${interview.company}\n`;
    if (interview.role) prompt += `Role: ${interview.role}\n\n`;

    prompt += `Questions and Answers:\n`;
    questions.forEach((q, index) => {
      prompt += `${index + 1}. Question: ${q.question}\n`;
      prompt += `   Type: ${q.type}, Difficulty: ${q.difficulty}\n`;
      if (answers[q.id]) {
        prompt += `   Answer: ${answers[q.id].answer}\n`;
      } else {
        prompt += `   Answer: Not provided\n`;
      }
      prompt += `\n`;
    });

    prompt += `\nPlease provide feedback in the following format:\n`;
    prompt += `1. Overall Score (0-100)\n`;
    prompt += `2. Strengths (list 3-5 key strengths)\n`;
    prompt += `3. Areas for Improvement (list 3-5 areas)\n`;
    prompt += `4. Question-by-Question Feedback (brief feedback for each answer)\n`;
    prompt += `5. Communication Skills Assessment\n`;
    prompt += `6. Technical/Behavioral Skills Assessment\n`;
    prompt += `7. Recommendations for Next Steps\n`;

    return prompt;
  }

  /**
   * Parse AI feedback response
   */
  private parseFeedbackResponse(content: string): any {
    try {
      const feedback: any = {
        overallScore: 0,
        strengths: [],
        improvements: [],
        questionFeedback: {},
        communication: '',
        skills: '',
        recommendations: [],
        rawFeedback: content,
      };

      // Extract score
      const scoreMatch = content.match(/(\d+)\s*(?:out of 100|/100|%)/i);
      if (scoreMatch) {
        feedback.overallScore = parseInt(scoreMatch[1]);
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
      const improvementsMatch = content.match(/(?:improvements?|areas for improvement)[:\-]?\s*(.*?)(?=\n\n|\n\d+\.|recommendations?|communication)/is);
      if (improvementsMatch) {
        feedback.improvements = improvementsMatch[1]
          .split(/[•\-\*]/)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 5);
      }

      // Extract recommendations
      const recommendationsMatch = content.match(/(?:recommendations?|next steps)[:\-]?\s*(.*?)(?=\n\n|$)/is);
      if (recommendationsMatch) {
        feedback.recommendations = recommendationsMatch[1]
          .split(/[•\-\*]/)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 5);
      }

      return feedback;
    } catch (error) {
      logger.error('Error parsing feedback response:', error);
      return {
        overallScore: 0,
        strengths: [],
        improvements: [],
        rawFeedback: content,
      };
    }
  }

  /**
   * Get student's mock interviews
   */
  async getStudentInterviews(studentId: string, options?: {
    status?: InterviewStatus;
    limit?: number;
    offset?: number;
  }) {
    try {
      const interviews = await this.prisma.mockInterview.findMany({
        where: {
          studentId,
          ...(options?.status && { status: options.status }),
        },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          scheduledAt: 'desc',
        },
        take: options?.limit || 20,
        skip: options?.offset || 0,
      });

      return interviews;
    } catch (error) {
      logger.error('Error getting student interviews:', error);
      throw error;
    }
  }

  /**
   * Get a specific mock interview
   */
  async getMockInterview(interviewId: string, studentId?: string) {
    try {
      const where: any = { id: interviewId };
      if (studentId) {
        where.studentId = studentId;
      }

      const interview = await this.prisma.mockInterview.findUnique({
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
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return interview;
    } catch (error) {
      logger.error('Error getting mock interview:', error);
      throw error;
    }
  }

  /**
   * Cancel mock interview
   */
  async cancelMockInterview(interviewId: string, userId: string) {
    try {
      const interview = await this.prisma.mockInterview.findUnique({
        where: { id: interviewId },
      });

      if (!interview) {
        throw new Error('Mock interview not found');
      }

      if (interview.studentId !== userId && interview.mentorId !== userId) {
        throw new Error('Unauthorized to cancel this interview');
      }

      const updated = await this.prisma.mockInterview.update({
        where: { id: interviewId },
        data: {
          status: InterviewStatus.CANCELLED,
        },
      });

      logger.info(`Mock interview ${interviewId} cancelled`);
      return updated;
    } catch (error) {
      logger.error('Error cancelling mock interview:', error);
      throw error;
    }
  }
}

export const mockInterviewService = new MockInterviewService();

