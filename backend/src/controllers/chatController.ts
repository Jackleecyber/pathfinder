import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import { ChatMessage, CascadeAction, APIResponse } from '@shared/types';
import { LLMService } from '../services/llmService';
import { ActionService } from '../services/actionService';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ChatController {
  private db = getDatabase();
  private llmService = new LLMService();
  private actionService = new ActionService();

  async getMessages(userId: string, options: { limit: number; offset: number }): Promise<APIResponse<ChatMessage[]>> {
    try {
      const messages = await this.db.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: options.limit,
        skip: options.offset,
        include: {
          actions: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      // Reverse to get chronological order
      const orderedMessages = messages.reverse();

      return {
        success: true,
        data: orderedMessages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
          actions: msg.actions.map(action => ({
            id: action.id,
            type: action.type as any,
            payload: action.payload as any,
            confidence: action.confidence,
            preview: action.preview as any,
            provenance: action.provenance as any,
            timestamp: action.createdAt.toISOString()
          })),
          timestamp: msg.createdAt.toISOString(),
          context: msg.context as any
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting chat messages:', error);
      throw error;
    }
  }

  async sendMessage(userId: string, data: { content: string; context?: any }): Promise<APIResponse<ChatMessage>> {
    try {
      // Save user message
      const userMessage = await this.db.chatMessage.create({
        data: {
          id: uuidv4(),
          userId,
          role: 'USER',
          content: data.content,
          context: data.context || {}
        }
      });

      // Generate AI response
      const aiResponse = await this.llmService.generateResponse({
        userMessage: data.content,
        context: data.context,
        conversationHistory: await this.getRecentMessages(userId, 10)
      });

      // Save AI response
      const assistantMessage = await this.db.chatMessage.create({
        data: {
          id: uuidv4(),
          userId,
          role: 'ASSISTANT',
          content: aiResponse.content,
          context: aiResponse.context || {}
        }
      });

      // Save any actions generated
      if (aiResponse.actions && aiResponse.actions.length > 0) {
        for (const actionData of aiResponse.actions) {
          await this.db.cascadeAction.create({
            data: {
              id: uuidv4(),
              userId,
              messageId: assistantMessage.id,
              type: actionData.type as any,
              payload: actionData.payload,
              confidence: actionData.confidence,
              preview: actionData.preview,
              provenance: actionData.provenance,
              status: 'PENDING'
            }
          });
        }
      }

      // Return the assistant message with actions
      const messageWithActions = await this.db.chatMessage.findUnique({
        where: { id: assistantMessage.id },
        include: {
          actions: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      return {
        success: true,
        data: {
          id: messageWithActions!.id,
          role: messageWithActions!.role as 'user' | 'assistant' | 'system',
          content: messageWithActions!.content,
          actions: messageWithActions!.actions.map(action => ({
            id: action.id,
            type: action.type as any,
            payload: action.payload as any,
            confidence: action.confidence,
            preview: action.preview as any,
            provenance: action.provenance as any,
            timestamp: action.createdAt.toISOString()
          })),
          timestamp: messageWithActions!.createdAt.toISOString(),
          context: messageWithActions!.context as any
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error sending chat message:', error);
      throw error;
    }
  }

  async executeAction(userId: string, actionData: any): Promise<APIResponse<CascadeAction>> {
    try {
      // Create action record
      const action = await this.db.cascadeAction.create({
        data: {
          id: uuidv4(),
          userId,
          type: actionData.type as any,
          payload: actionData.payload,
          confidence: actionData.confidence,
          preview: actionData.preview,
          provenance: actionData.provenance,
          status: 'EXECUTING'
        }
      });

      try {
        // Execute the action
        const result = await this.actionService.executeAction(actionData);
        
        // Update action status
        await this.db.cascadeAction.update({
          where: { id: action.id },
          data: {
            status: 'COMPLETED',
            executedAt: new Date(),
            result: result
          }
        });

        return {
          success: true,
          data: {
            id: action.id,
            type: action.type as any,
            payload: action.payload as any,
            confidence: action.confidence,
            preview: action.preview as any,
            provenance: action.provenance as any,
            timestamp: action.createdAt.toISOString()
          },
          timestamp: new Date().toISOString()
        };
      } catch (executionError) {
        // Update action status to error
        await this.db.cascadeAction.update({
          where: { id: action.id },
          data: {
            status: 'ERROR',
            error: executionError instanceof Error ? executionError.message : 'Unknown error'
          }
        });

        throw executionError;
      }
    } catch (error) {
      logger.error('Error executing action:', error);
      throw error;
    }
  }

  async getSuggestions(userId: string, context: { context?: any; selectedRange?: any }): Promise<APIResponse<CascadeAction[]>> {
    try {
      const suggestions = await this.llmService.generateSuggestions({
        context: context.context,
        selectedRange: context.selectedRange,
        userHistory: await this.getRecentMessages(userId, 5)
      });

      return {
        success: true,
        data: suggestions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting suggestions:', error);
      throw error;
    }
  }

  async clearHistory(userId: string): Promise<APIResponse<{ message: string }>> {
    try {
      // Delete all chat messages and related actions
      await this.db.cascadeAction.deleteMany({
        where: { userId }
      });

      await this.db.chatMessage.deleteMany({
        where: { userId }
      });

      return {
        success: true,
        data: { message: 'Chat history cleared successfully' },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error clearing chat history:', error);
      throw error;
    }
  }

  private async getRecentMessages(userId: string, limit: number): Promise<any[]> {
    try {
      const messages = await this.db.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          role: true,
          content: true,
          context: true,
          createdAt: true
        }
      });

      return messages.reverse();
    } catch (error) {
      logger.error('Error getting recent messages:', error);
      return [];
    }
  }
}
