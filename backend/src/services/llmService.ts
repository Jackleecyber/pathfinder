import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { CascadeAction, LLMRequest, LLMResponse } from '@shared/types';
import { logger } from '../utils/logger';

export class LLMService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    if (config.ai.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.ai.openai.apiKey,
      });
    }

    if (config.ai.anthropic.apiKey) {
      this.anthropic = new Anthropic({
        apiKey: config.ai.anthropic.apiKey,
      });
    }
  }

  async generateResponse(request: {
    userMessage: string;
    context?: any;
    conversationHistory?: any[];
  }): Promise<{
    content: string;
    actions?: CascadeAction[];
    context?: any;
  }> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await this.callLLM({
        prompt,
        context: request.context,
        temperature: config.ai.openai.temperature,
        maxTokens: config.ai.openai.maxTokens,
        model: config.ai.openai.model
      });

      // Parse the response to extract actions
      const parsedResponse = this.parseResponse(response.content);
      
      return {
        content: parsedResponse.content,
        actions: parsedResponse.actions,
        context: request.context
      };
    } catch (error) {
      logger.error('Error generating LLM response:', error);
      throw error;
    }
  }

  async generateSuggestions(request: {
    context?: any;
    selectedRange?: any;
    userHistory?: any[];
  }): Promise<CascadeAction[]> {
    try {
      const prompt = this.buildSuggestionsPrompt(request);
      
      const response = await this.callLLM({
        prompt,
        context: request.context,
        temperature: 0.1, // Lower temperature for more consistent suggestions
        maxTokens: 2000,
        model: config.ai.openai.model
      });

      return this.parseSuggestions(response.content);
    } catch (error) {
      logger.error('Error generating suggestions:', error);
      return [];
    }
  }

  async analyzeFinancialData(data: any[]): Promise<any> {
    try {
      const prompt = this.buildFinancialAnalysisPrompt(data);
      
      const response = await this.callLLM({
        prompt,
        temperature: 0.1,
        maxTokens: 3000,
        model: config.ai.openai.model
      });

      return this.parseFinancialAnalysis(response.content);
    } catch (error) {
      logger.error('Error analyzing financial data:', error);
      throw error;
    }
  }

  async generateFormula(request: {
    description: string;
    data?: any;
    context?: any;
  }): Promise<{
    formula: string;
    description: string;
    confidence: number;
  }> {
    try {
      const prompt = this.buildFormulaPrompt(request);
      
      const response = await this.callLLM({
        prompt,
        context: request.context,
        temperature: 0.1,
        maxTokens: 1000,
        model: config.ai.openai.model
      });

      return this.parseFormula(response.content);
    } catch (error) {
      logger.error('Error generating formula:', error);
      throw error;
    }
  }

  private async callLLM(request: LLMRequest): Promise<LLMResponse> {
    try {
      // Try OpenAI first, fallback to Anthropic
      if (this.openai) {
        return await this.callOpenAI(request);
      } else if (this.anthropic) {
        return await this.callAnthropic(request);
      } else {
        throw new Error('No AI service configured');
      }
    } catch (error) {
      logger.error('Error calling LLM:', error);
      throw error;
    }
  }

  private async callOpenAI(request: LLMRequest): Promise<LLMResponse> {
    if (!this.openai) throw new Error('OpenAI not configured');

    const response = await this.openai.chat.completions.create({
      model: request.model || config.ai.openai.model,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: request.prompt
        }
      ],
      temperature: request.temperature || config.ai.openai.temperature,
      max_tokens: request.maxTokens || config.ai.openai.maxTokens,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      confidence: 0.9,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0
      }
    };
  }

  private async callAnthropic(request: LLMRequest): Promise<LLMResponse> {
    if (!this.anthropic) throw new Error('Anthropic not configured');

    const response = await this.anthropic.messages.create({
      model: request.model || config.ai.anthropic.model,
      max_tokens: request.maxTokens || config.ai.anthropic.maxTokens,
      temperature: request.temperature || 0.1,
      messages: [
        {
          role: 'user',
          content: `${this.getSystemPrompt()}\n\n${request.prompt}`
        }
      ]
    });

    return {
      content: response.content[0]?.type === 'text' ? response.content[0].text : '',
      confidence: 0.9,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      }
    };
  }

  private getSystemPrompt(): string {
    return `You are Cascade, an AI assistant specialized in Excel financial analysis and automation. You help finance professionals with:

1. Data extraction and cleaning
2. Financial analysis and modeling
3. Formula generation
4. Chart creation
5. Pivot table building

Always respond with structured JSON when providing actions. Use this format:

{
  "content": "Your response to the user",
  "actions": [
    {
      "type": "action_type",
      "payload": {...},
      "confidence": 0.95,
      "preview": {...},
      "provenance": {...}
    }
  ]
}

Available action types:
- insert_values: Insert data into Excel
- generate_formula: Create Excel formulas
- create_chart: Generate charts
- build_pivot: Create pivot tables
- extract_data: Extract data from files/web
- analyze_financials: Analyze financial statements

Always provide high-confidence, actionable responses.`;
  }

  private buildPrompt(request: {
    userMessage: string;
    context?: any;
    conversationHistory?: any[];
  }): string {
    let prompt = `User message: ${request.userMessage}\n\n`;

    if (request.context) {
      prompt += `Context: ${JSON.stringify(request.context, null, 2)}\n\n`;
    }

    if (request.conversationHistory && request.conversationHistory.length > 0) {
      prompt += `Recent conversation:\n`;
      request.conversationHistory.forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `Please provide a helpful response with any appropriate actions.`;

    return prompt;
  }

  private buildSuggestionsPrompt(request: {
    context?: any;
    selectedRange?: any;
    userHistory?: any[];
  }): string {
    let prompt = `Based on the current Excel context, suggest relevant actions:\n\n`;

    if (request.selectedRange) {
      prompt += `Selected range: ${JSON.stringify(request.selectedRange, null, 2)}\n\n`;
    }

    if (request.context) {
      prompt += `Workbook context: ${JSON.stringify(request.context, null, 2)}\n\n`;
    }

    prompt += `Generate 3-5 relevant action suggestions with high confidence scores.`;

    return prompt;
  }

  private buildFinancialAnalysisPrompt(data: any[]): string {
    return `Analyze the following financial data and provide insights:

${JSON.stringify(data, null, 2)}

Please provide:
1. Key metrics and ratios
2. Trends and patterns
3. Potential issues or anomalies
4. Recommendations

Format as structured analysis.`;
  }

  private buildFormulaPrompt(request: {
    description: string;
    data?: any;
    context?: any;
  }): string {
    let prompt = `Generate an Excel formula for: ${request.description}\n\n`;

    if (request.data) {
      prompt += `Data context: ${JSON.stringify(request.data, null, 2)}\n\n`;
    }

    prompt += `Provide the formula, explanation, and confidence score.`;

    return prompt;
  }

  private parseResponse(content: string): {
    content: string;
    actions?: CascadeAction[];
  } {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return {
        content: parsed.content || content,
        actions: parsed.actions || []
      };
    } catch {
      // If not JSON, return as plain text
      return {
        content: content,
        actions: []
      };
    }
  }

  private parseSuggestions(content: string): CascadeAction[] {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : parsed.actions || [];
    } catch {
      return [];
    }
  }

  private parseFinancialAnalysis(content: string): any {
    try {
      return JSON.parse(content);
    } catch {
      return { analysis: content };
    }
  }

  private parseFormula(content: string): {
    formula: string;
    description: string;
    confidence: number;
  } {
    try {
      const parsed = JSON.parse(content);
      return {
        formula: parsed.formula || '',
        description: parsed.description || '',
        confidence: parsed.confidence || 0.8
      };
    } catch {
      return {
        formula: '',
        description: content,
        confidence: 0.5
      };
    }
  }
}
