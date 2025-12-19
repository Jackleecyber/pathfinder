// Core application types shared between frontend and backend

export interface CascadeAction {
  id: string;
  type: 'insert_values' | 'generate_formula' | 'create_chart' | 'build_pivot' | 'ask_clarification' | 'extract_data' | 'analyze_financials';
  payload: any;
  confidence: number;
  preview?: any;
  provenance?: Provenance;
  timestamp: string;
}

export interface Provenance {
  source: 'file' | 'web' | 'api' | 'user_input';
  filePath?: string;
  url?: string;
  apiEndpoint?: string;
  pageNumber?: number;
  tableIndex?: number;
  extractionMethod: string;
  timestamp: string;
}

export interface FinancialData {
  id: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'transaction_data' | 'market_data';
  period: string;
  values: Record<string, number>;
  metadata: {
    currency: string;
    units: string;
    source: Provenance;
  };
}

export interface ExcelRange {
  address: string;
  worksheet: string;
  values: any[][];
  formulas?: string[][];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  actions?: CascadeAction[];
  timestamp: string;
  context?: {
    selectedRange?: ExcelRange;
    activeWorksheet?: string;
    workbookContext?: any;
  };
}

export interface FileUpload {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'csv' | 'word' | 'image';
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedData?: FinancialData[];
  error?: string;
  uploadedAt: string;
}

export interface WebScrapeRequest {
  url: string;
  selectors?: string[];
  extractTables?: boolean;
  extractText?: boolean;
  format?: 'json' | 'csv' | 'excel';
}

export interface WebScrapeResult {
  id: string;
  url: string;
  title: string;
  extractedData: {
    tables: any[];
    text: string;
    metadata: any;
  };
  status: 'success' | 'error';
  error?: string;
  scrapedAt: string;
}

export interface FinancialModel {
  id: string;
  name: string;
  type: 'dcf' | 'comparable' | 'precedent' | 'lbo' | 'custom';
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  formulas: Record<string, string>;
  scenarios?: {
    base: Record<string, any>;
    optimistic: Record<string, any>;
    pessimistic: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DataConnector {
  id: string;
  name: string;
  type: 'bloomberg' | 'factset' | 'capiq' | 'refinitiv' | 'pitchbook' | 'custom';
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  defaultCurrency: string;
  autoSave: boolean;
  notifications: {
    email: boolean;
    inApp: boolean;
  };
  shortcuts: Record<string, string>;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Excel-specific types
export interface ExcelWorksheet {
  name: string;
  id: string;
  isActive: boolean;
  ranges: ExcelRange[];
}

export interface ExcelWorkbook {
  name: string;
  worksheets: ExcelWorksheet[];
  activeWorksheet: string;
  metadata: {
    author: string;
    created: string;
    modified: string;
  };
}

// AI/ML specific types
export interface LLMRequest {
  prompt: string;
  context?: any;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  actions?: CascadeAction[];
  confidence: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
}

// Error types
export interface CascadeError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  fileUploadLimit: number;
  supportedFileTypes: string[];
  aiModels: {
    primary: string;
    fallback: string;
    embedding: string;
  };
  features: {
    webScraping: boolean;
    fileProcessing: boolean;
    aiAnalysis: boolean;
    dataConnectors: boolean;
  };
}

// Mentorship Platform Types
export type Industry = 'FINANCE' | 'CONSULTING' | 'TECHNOLOGY' | 'INVESTMENT_BANKING' | 'PRIVATE_EQUITY' | 'VENTURE_CAPITAL' | 'HEDGE_FUND' | 'ASSET_MANAGEMENT' | 'CORPORATE_STRATEGY' | 'PRODUCT_MANAGEMENT' | 'SOFTWARE_ENGINEERING' | 'DATA_SCIENCE' | 'OTHER';
export type CareerStage = 'EXPLORING' | 'PREPARING' | 'APPLYING' | 'INTERVIEWING' | 'NEGOTIATING' | 'ACCEPTED';
export type MentorType = 'INDUSTRY_EXPERT' | 'RECRUITER' | 'CAREER_COACH' | 'TECHNICAL_MENTOR' | 'BEHAVIORAL_COACH';
export type CVStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'NEEDS_REVISION';
export type InterviewType = 'TECHNICAL' | 'BEHAVIORAL' | 'CASE_STUDY' | 'SYSTEM_DESIGN' | 'MIXED';
export type InterviewStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type QuestionType = 'TECHNICAL' | 'BEHAVIORAL' | 'CASE_STUDY' | 'SYSTEM_DESIGN' | 'BRAIN_TEASER';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type SessionType = 'ONE_ON_ONE' | 'GROUP' | 'WORKSHOP' | 'WEBINAR' | 'MOCK_INTERVIEW' | 'CV_REVIEW' | 'NETWORKING';
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'NEGOTIATING' | 'EXPIRED';

export interface StudentProfile {
  id: string;
  userId: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  targetIndustry: Industry[];
  targetRoles: string[];
  currentStage: CareerStage;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  languages: string[];
  timezone?: string;
  preferredMentorTypes: MentorType[];
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  currentCompany?: string;
  currentRole?: string;
  previousCompanies: string[];
  industries: Industry[];
  expertise: string[];
  yearsExperience?: number;
  education?: any;
  certifications: string[];
  bio?: string;
  linkedinUrl?: string;
  availability?: any;
  maxStudents: number;
  currentStudents: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isActive: boolean;
  timezone?: string;
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CV {
  id: string;
  studentId: string;
  title: string;
  version: string;
  content: any;
  fileUrl?: string;
  status: CVStatus;
  aiFeedback?: any;
  mentorFeedback?: any;
  score?: number;
  lastReviewedAt?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockInterview {
  id: string;
  studentId: string;
  mentorId?: string;
  title: string;
  type: InterviewType;
  industry?: Industry;
  company?: string;
  role?: string;
  status: InterviewStatus;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  recordingUrl?: string;
  transcript?: any;
  questions?: any;
  studentAnswers?: any;
  feedback?: any;
  score?: number;
  strengths: string[];
  improvements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  mentorId?: string;
  type: QuestionType;
  category: string;
  industry?: Industry;
  difficulty: Difficulty;
  question: string;
  expectedAnswer?: string;
  tips: string[];
  keywords: string[];
  isVerified: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipSession {
  id: string;
  studentId: string;
  mentorId: string;
  type: SessionType;
  title: string;
  description?: string;
  status: SessionStatus;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  notes?: string;
  actionItems?: any;
  recordingUrl?: string;
  studentRating?: number;
  mentorRating?: number;
  studentFeedback?: string;
  mentorFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobOffer {
  id: string;
  studentId: string;
  company: string;
  role: string;
  industry: Industry;
  location?: string;
  salary?: number;
  bonus?: number;
  totalComp?: number;
  currency: string;
  offerDate: string;
  deadline?: string;
  status: OfferStatus;
  notes?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressTracking {
  id: string;
  studentId: string;
  category: string;
  metric: string;
  value: number;
  target?: number;
  notes?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}