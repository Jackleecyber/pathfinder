import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIResponse } from '@shared/types';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('cascade_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<APIResponse>) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('cascade_token');
      // Could trigger a redirect or show login modal
    } else if (error.response?.status === 403) {
      // Forbidden - show permission error
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error - show generic error message
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Utility function to generate request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<APIResponse<T>>> =>
    apiClient.get(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<APIResponse<T>>> =>
    apiClient.post(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<APIResponse<T>>> =>
    apiClient.put(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<APIResponse<T>>> =>
    apiClient.patch(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<APIResponse<T>>> =>
    apiClient.delete(url, config),
};

// Specific API methods for Cascade
export const cascadeAPI = {
  // Health check
  health: () => api.get('/health'),
  
  // Chat
  chat: {
    getMessages: () => api.get('/chat/messages'),
    sendMessage: (content: string, context?: any) => 
      api.post('/chat/send', { content, context }),
    executeAction: (action: any) => 
      api.post('/actions/execute', action),
  },
  
  // File operations
  files: {
    getUploads: () => api.get('/files/uploads'),
    upload: (file: File, metadata?: any) => {
      const formData = new FormData();
      formData.append('file', file);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      return api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    process: (fileId: string) => api.post(`/files/${fileId}/process`),
    delete: (fileId: string) => api.delete(`/files/${fileId}`),
    download: (fileId: string) => api.get(`/files/${fileId}/download`),
  },
  
  // Web scraping
  scraping: {
    getResults: () => api.get('/scraping/results'),
    scrape: (request: any) => api.post('/scraping/scrape', request),
    delete: (scrapeId: string) => api.delete(`/scraping/${scrapeId}`),
  },
  
  // Financial analysis
  analysis: {
    financials: (data: any[]) => api.post('/analysis/financials', { data }),
    model: (type: string, inputs: any) => api.post('/analysis/model', { type, inputs }),
    metrics: (data: any[], metrics: string[]) => api.post('/analysis/metrics', { data, metrics }),
  },
  
  // Data connectors
  connectors: {
    get: () => api.get('/connectors'),
    connect: (service: string, config: any) => api.post(`/connectors/${service}/connect`, config),
    disconnect: (service: string) => api.post(`/connectors/${service}/disconnect`),
    sync: (service: string, params: any) => api.post(`/connectors/${service}/sync`, params),
  },
  
  // User preferences
  preferences: {
    get: () => api.get('/preferences'),
    update: (preferences: any) => api.put('/preferences', preferences),
  },
  
  // Audit logs
  audit: {
    getLogs: (filters?: any) => api.get('/audit/logs', { params: filters }),
  },
};

export { apiClient };
export default apiClient;
