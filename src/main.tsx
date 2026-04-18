import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './app/App';
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode><QueryClientProvider client={queryClient}><App /><Toaster position="top-right" /></QueryClientProvider></React.StrictMode>);
