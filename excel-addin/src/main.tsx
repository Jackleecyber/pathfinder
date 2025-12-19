import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Initialize Office.js
Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });

    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </QueryClientProvider>
      </React.StrictMode>
    );
  } else {
    // Show error if not running in Excel
    const root = document.getElementById('root')!;
    root.innerHTML = `
      <div class="error">
        <h3>Error: Cascade requires Excel</h3>
        <p>This add-in can only run within Microsoft Excel. Please open Excel and try again.</p>
      </div>
    `;
  }
});
