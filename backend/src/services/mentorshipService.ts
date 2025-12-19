import { getDatabase } from '../database/connection';
import { logger } from '../utils/logger';
import { Industry, MentorType, SessionType, SessionStatus } from '@prisma/client';

export class MentorshipService {
  private prisma = getDatabase();

  /**
   * Create or update student profile
   */
  async createOrUpdateStudentProfile(userId: string, data: {
    university?: string;
    major?: string;
    graduationYear?: number;
    gpa?: number;
    targetIndustry?: Industry[];
    targetRoles?: string[];
    currentStage?: string;
    bio?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    skills?: string[];
    languages?: string[];
    timezone?: string;
    preferredMentorTypes?: MentorType[];
  }) {
    try {
      const profile = await this.prisma.studentProfile.upsert({
        where: { userId },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        create: {
          userId,
          ...data,
        },
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
      });

      logger.info(`Student profile ${profile.id} created/updated for user ${userId}`);
      return profile;
    } catch (error) {
      logger.error('Error creating/updating student profile:', error);
      throw error;
    }
  }

  /**
   * Create or update mentor profile
   */
  async createOrUpdateMentorProfile(userId: string, data: {
    currentCompany?: string;
    currentRole?: string;
    previousCompanies?: string[];
    industries?: Industry[];
    expertise?: string[];
    yearsExperience?: number;
    education?: any;
    certifications?: string[];
    bio?: string;
    linkedinUrl?: string;
    availability?: any;
    maxStudents?: number;
    timezone?: string;
    languages?: string[];
    isVerified?: boolean;
  }) {
    try {
      const profile = await this.prisma.mentorProfile.upsert({
        where: { userId },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        create: {
          userId,
          ...data,
        },
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
      });

      logger.info(`Mentor profile ${profile.id} created/updated for user ${userId}`);
      return profile;
    } catch (error) {
      logger.error('Error creating/updating mentor profile:', error);
      throw error;
    }
  }

  /**
   * Find matching mentors for a student
   */
  async findMatchingMentors(studentId: string, options?: {
    industries?: Industry[];
    mentorTypes?: MentorType[];
    limit?: number;
  }) {
    try {
      const student = await this.prisma.studentProfile.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) {
        throw new Error('Student profile not found');
      }

      const where: any = {
        isActive: true,
        currentStudents: { lt: this.prisma.mentorProfile.fields.maxStudents },
      };

      if (options?.industries && options.industries.length > 0) {
        where.industries = { hasSome: options.industries };
      } else if (student.targetIndustry && student.targetIndustry.length > 0) {
        where.industries = { hasSome: student.targetIndustry };
      }

      const mentors = await this.prisma.mentorProfile.findMany({
        where,
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
        orderBy: [
          { rating: 'desc' },
          { totalReviews: 'desc' },
        ],
        take: options?.limit || 10,
      });

      // Score and rank mentors based on match quality
      const scoredMentors = mentors.map(mentor => {
        let score = 0;
        
        // Industry match
        if (student.targetIndustry && mentor.industries) {
          const industryMatch = student.targetIndustry.filter(industry =>
            mentor.industries.includes(industry)
          ).length;
          score += industryMatch * 10;
        }

        // Rating bonus
        score += mentor.rating * 2;

        // Experience bonus
        if (mentor.yearsExperience) {
          score += Math.min(mentor.yearsExperience / 2, 10);
        }

        // Verified mentor bonus
        if (mentor.isVerified) {
          score += 5;
        }

        return {
          ...mentor,
          matchScore: score,
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return scoredMentors;
    } catch (error) {
      logger.error('Error finding matching mentors:', error);
      throw error;
    }
  }

  /**
   * Schedule a mentorship session
   */
  async scheduleSession(data: {
    studentId: string;
    mentorId: string;
    type: SessionType;
    title: string;
    description?: string;
    scheduledAt: Date;
  }) {
    try {
      const session = await this.prisma.mentorshipSession.create({
        data: {
          ...data,
          status: SessionStatus.SCHEDULED,
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

      logger.info(`Mentorship session ${session.id} scheduled`);
      return session;
    } catch (error) {
      logger.error('Error scheduling mentorship session:', error);
      throw error;
    }
  }

  /**
   * Get student's mentorship sessions
   */
  async getStudentSessions(studentId: string, options?: {
    status?: SessionStatus;
    limit?: number;
    offset?: number;
  }) {
    try {
      const sessions = await this.prisma.mentorshipSession.findMany({
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

      return sessions;
    } catch (error) {
      logger.error('Error getting student sessions:', error);
      throw error;
    }
  }

  /**
   * Get mentor's sessions
   */
  async getMentorSessions(mentorId: string, options?: {
    status?: SessionStatus;
    limit?: number;
    offset?: number;
  }) {
    try {
      const sessions = await this.prisma.mentorshipSession.findMany({
        where: {
          mentorId,
          ...(options?.status && { status: options.status }),
        },
        include: {
          student: {
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

      return sessions;
    } catch (error) {
      logger.error('Error getting mentor sessions:', error);
      throw error;
    }
  }

  /**
   * Update session status
   */
  async updateSessionStatus(sessionId: string, status: SessionStatus, userId: string) {
    try {
      const session = await this.prisma.mentorshipSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Verify user has permission
      if (session.studentId !== userId && session.mentorId !== userId) {
        throw new Error('Unauthorized to update this session');
      }

      const updateData: any = { status };

      if (status === SessionStatus.IN_PROGRESS && !session.startedAt) {
        updateData.startedAt = new Date();
      }

      if (status === SessionStatus.COMPLETED && !session.completedAt) {
        updateData.completedAt = new Date();
        if (session.startedAt) {
          updateData.duration = Math.floor(
            (new Date().getTime() - session.startedAt.getTime()) / 1000 / 60
          );
        }
      }

      const updated = await this.prisma.mentorshipSession.update({
        where: { id: sessionId },
        data: updateData,
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

      logger.info(`Session ${sessionId} status updated to ${status}`);
      return updated;
    } catch (error) {
      logger.error('Error updating session status:', error);
      throw error;
    }
  }

  /**
   * Add feedback to a session
   */
  async addSessionFeedback(sessionId: string, data: {
    studentRating?: number;
    mentorRating?: number;
    studentFeedback?: string;
    mentorFeedback?: string;
    notes?: string;
    actionItems?: any;
  }, userId: string) {
    try {
      const session = await this.prisma.mentorshipSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const isStudent = session.studentId === userId;
      const isMentor = session.mentorId === userId;

      if (!isStudent && !isMentor) {
        throw new Error('Unauthorized to add feedback to this session');
      }

      const updateData: any = {};

      if (isStudent) {
        if (data.studentRating !== undefined) updateData.studentRating = data.studentRating;
        if (data.studentFeedback) updateData.studentFeedback = data.studentFeedback;
      }

      if (isMentor) {
        if (data.mentorRating !== undefined) updateData.mentorRating = data.mentorRating;
        if (data.mentorFeedback) updateData.mentorFeedback = data.mentorFeedback;
      }

      if (data.notes) updateData.notes = data.notes;
      if (data.actionItems) updateData.actionItems = data.actionItems;

      const updated = await this.prisma.mentorshipSession.update({
        where: { id: sessionId },
        data: updateData,
      });

      // Update mentor rating if student provided rating
      if (isStudent && data.studentRating) {
        await this.updateMentorRating(session.mentorId);
      }

      logger.info(`Feedback added to session ${sessionId}`);
      return updated;
    } catch (error) {
      logger.error('Error adding session feedback:', error);
      throw error;
    }
  }

  /**
   * Update mentor's overall rating based on all session ratings
   */
  private async updateMentorRating(mentorId: string) {
    try {
      const sessions = await this.prisma.mentorshipSession.findMany({
        where: {
          mentorId,
          studentRating: { not: null },
        },
        select: {
          studentRating: true,
        },
      });

      if (sessions.length === 0) return;

      const totalRating = sessions.reduce((sum, s) => sum + (s.studentRating || 0), 0);
      const averageRating = totalRating / sessions.length;

      await this.prisma.mentorProfile.update({
        where: { id: mentorId },
        data: {
          rating: averageRating,
          totalReviews: sessions.length,
        },
      });
    } catch (error) {
      logger.error('Error updating mentor rating:', error);
    }
  }

  /**
   * Get student profile
   */
  async getStudentProfile(userId: string) {
    try {
      const profile = await this.prisma.studentProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              mentorshipSessions: true,
              mockInterviews: true,
              jobOffers: true,
            },
          },
        },
      });

      return profile;
    } catch (error) {
      logger.error('Error getting student profile:', error);
      throw error;
    }
  }

  /**
   * Get mentor profile
   */
  async getMentorProfile(userId: string) {
    try {
      const profile = await this.prisma.mentorProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              mentorshipSessions: true,
              interviewQuestions: true,
            },
          },
        },
      });

      return profile;
    } catch (error) {
      logger.error('Error getting mentor profile:', error);
      throw error;
    }
  }
}

export const mentorshipService = new MentorshipService();

