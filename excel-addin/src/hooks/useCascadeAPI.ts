import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  CascadeAction, 
  ChatMessage, 
  FileUpload, 
  WebScrapeRequest, 
  WebScrapeResult,
  FinancialData,
  APIResponse 
} from '@shared/types';
import { apiClient } from '../services/apiClient';

export const useCascadeAPI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await apiClient.get('/health');
        setIsConnected(response.data.success);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return { isConnected };
};

export const useChat = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ChatMessage[]>(
    'chat-messages',
    async () => {
      const response = await apiClient.get('/chat/messages');
      return response.data.data;
    },
    {
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    }
  );

  const sendMessage = useMutation(
    async (content: string) => {
      const response = await apiClient.post('/chat/send', { content });
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('chat-messages');
      },
    }
  );

  const executeAction = useMutation(
    async (action: CascadeAction) => {
      const response = await apiClient.post('/actions/execute', action);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('chat-messages');
      },
    }
  );

  return {
    messages: messages || [],
    isLoading,
    sendMessage: sendMessage.mutateAsync,
    executeAction: executeAction.mutateAsync,
    isSending: sendMessage.isLoading,
    isExecuting: executeAction.isLoading,
  };
};

export const useFileUpload = () => {
  const queryClient = useQueryClient();

  const { data: uploads, isLoading } = useQuery<FileUpload[]>(
    'file-uploads',
    async () => {
      const response = await apiClient.get('/files/uploads');
      return response.data.data;
    }
  );

  const uploadFile = useMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('file-uploads');
      },
    }
  );

  const processFile = useMutation(
    async (fileId: string) => {
      const response = await apiClient.post(`/files/${fileId}/process`);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('file-uploads');
      },
    }
  );

  const deleteFile = useMutation(
    async (fileId: string) => {
      await apiClient.delete(`/files/${fileId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('file-uploads');
      },
    }
  );

  return {
    uploads: uploads || [],
    isLoading,
    uploadFile: uploadFile.mutateAsync,
    processFile: processFile.mutateAsync,
    deleteFile: deleteFile.mutateAsync,
    isUploading: uploadFile.isLoading,
    isProcessing: processFile.isLoading,
    isDeleting: deleteFile.isLoading,
  };
};

export const useWebScraping = () => {
  const queryClient = useQueryClient();

  const { data: scrapes, isLoading } = useQuery<WebScrapeResult[]>(
    'web-scrapes',
    async () => {
      const response = await apiClient.get('/scraping/results');
      return response.data.data;
    }
  );

  const scrapeUrl = useMutation(
    async (request: WebScrapeRequest) => {
      const response = await apiClient.post('/scraping/scrape', request);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('web-scrapes');
      },
    }
  );

  const deleteScrape = useMutation(
    async (scrapeId: string) => {
      await apiClient.delete(`/scraping/${scrapeId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('web-scrapes');
      },
    }
  );

  return {
    scrapes: scrapes || [],
    isLoading,
    scrapeUrl: scrapeUrl.mutateAsync,
    deleteScrape: deleteScrape.mutateAsync,
    isScraping: scrapeUrl.isLoading,
    isDeleting: deleteScrape.isLoading,
  };
};

export const useFinancialAnalysis = () => {
  const analyzeFinancials = useMutation(
    async (data: FinancialData[]) => {
      const response = await apiClient.post('/analysis/financials', { data });
      return response.data.data;
    }
  );

  const generateModel = useMutation(
    async (type: string, inputs: any) => {
      const response = await apiClient.post('/analysis/model', { type, inputs });
      return response.data.data;
    }
  );

  const calculateMetrics = useMutation(
    async (data: any[], metrics: string[]) => {
      const response = await apiClient.post('/analysis/metrics', { data, metrics });
      return response.data.data;
    }
  );

  return {
    analyzeFinancials: analyzeFinancials.mutateAsync,
    generateModel: generateModel.mutateAsync,
    calculateMetrics: calculateMetrics.mutateAsync,
    isAnalyzing: analyzeFinancials.isLoading,
    isGenerating: generateModel.isLoading,
    isCalculating: calculateMetrics.isLoading,
  };
};

export const useDataConnectors = () => {
  const queryClient = useQueryClient();

  const { data: connectors, isLoading } = useQuery(
    'data-connectors',
    async () => {
      const response = await apiClient.get('/connectors');
      return response.data.data;
    }
  );

  const connectService = useMutation(
    async (service: string, config: any) => {
      const response = await apiClient.post(`/connectors/${service}/connect`, config);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('data-connectors');
      },
    }
  );

  const disconnectService = useMutation(
    async (service: string) => {
      await apiClient.post(`/connectors/${service}/disconnect`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('data-connectors');
      },
    }
  );

  const syncData = useMutation(
    async (service: string, params: any) => {
      const response = await apiClient.post(`/connectors/${service}/sync`, params);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('data-connectors');
      },
    }
  );

  return {
    connectors: connectors || [],
    isLoading,
    connectService: connectService.mutateAsync,
    disconnectService: disconnectService.mutateAsync,
    syncData: syncData.mutateAsync,
    isConnecting: connectService.isLoading,
    isDisconnecting: disconnectService.isLoading,
    isSyncing: syncData.isLoading,
  };
};
