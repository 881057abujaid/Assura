import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

/**
 * Root React Component.
 * Integrates global route declarations and toast notification layers.
 */
function App() {
  return (
    <>
      {/* Route Router Container */}
      <AppRoutes />

      {/* Global Notification Toaster */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a', // Slate 900
            color: '#f8fafc', // Slate 50
            border: '1px solid #1e293b', // Slate 800
            borderRadius: '12px',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#6366f1', // Indigo 500
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e', // Rose 500
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
