import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useChat } from '../hooks/useCascadeAPI';
import { CascadeAction, ExcelRange, ChatMessage } from '@shared/types';
import ActionPreview from './ActionPreview';

interface ChatInterfaceProps {
  selectedRange?: ExcelRange | null;
  onActionExecute: (action: CascadeAction) => Promise<void>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedRange, 
  onActionExecute 
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    executeAction, 
    isSending, 
    isExecuting 
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      await sendMessage(message, {
        selectedRange,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = async (action: CascadeAction) => {
    try {
      await executeAction(action);
      await onActionExecute(action);
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const formatMessage = (message: ChatMessage) => {
    // Simple markdown-like formatting
    return message.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

  const getMessageIcon = (role: string) => {
    switch (role) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'assistant':
        return <Bot className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (isLoading: boolean, isError?: boolean) => {
    if (isLoading) return <Loader className="w-4 h-4 animate-spin" />;
    if (isError) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-3 d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div className={`d-flex align-items-start ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`d-flex align-items-center justify-content-center rounded-circle ${
                  message.role === 'user' ? 'bg-primary text-white ml-2' : 'bg-light text-dark mr-2'
                }`} style={{ width: '32px', height: '32px' }}>
                  {getMessageIcon(message.role)}
                </div>
                
                {/* Message Content */}
                <div className={`card ${message.role === 'user' ? 'bg-primary text-white' : ''}`} style={{ maxWidth: '80%' }}>
                  <div className="card-body p-2">
                    <div 
                      className="mb-2"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
                    />
                    
                    {/* Actions */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2">
                        {message.actions.map((action, actionIndex) => (
                          <ActionPreview
                            key={actionIndex}
                            action={action}
                            onExecute={() => handleActionClick(action)}
                            isExecuting={isExecuting}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className={`text-end mt-2 ${message.role === 'user' ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="d-flex align-items-center mb-3"
          >
            <div className="d-flex align-items-center justify-content-center bg-light text-dark rounded-circle mr-2" style={{ width: '32px', height: '32px' }}>
              <Bot className="w-4 h-4" />
            </div>
            <div className="card bg-light">
              <div className="card-body p-2">
                <div className="d-flex align-items-center">
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-muted">Cascade is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Range Info */}
      {selectedRange && (
        <div className="card-header bg-light">
          <div className="d-flex align-items-center">
            <div className="text-success mr-2">●</div>
            <small className="text-muted">
              Selected: {selectedRange.worksheet}!{selectedRange.address}
            </small>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="card-header">
        <div className="d-flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Cascade to analyze data, create formulas, or extract information..."
            className="form-control flex-1 mr-2"
            rows={2}
            disabled={isSending}
            style={{ resize: 'none' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            className="btn btn-primary"
          >
            {isSending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-2">
          <div className="d-flex flex-wrap gap-1">
            {[
              'Clean this table',
              'Calculate CAGR',
              'Create pivot table',
              'Extract financials',
              'Build DCF model'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="btn btn-sm btn-secondary"
                disabled={isSending}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
