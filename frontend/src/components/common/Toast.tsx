import React, { useState, useEffect, createContext, useContext } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = ({ message, type, duration = 3000 }: ToastProps) => {
    setToast({ message, type, duration });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-0 inset-x-0 pb-6 px-4 sm:px-6 sm:pb-8 z-50 pointer-events-none">
          <div className="max-w-md mx-auto">
            <div
              className={`rounded-lg p-4 flex items-center justify-between transform transition-all duration-300 ease-out ${
                toast.type === 'success'
                  ? 'bg-green-600'
                  : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
              }`}
            >
              <div className="flex-1 w-0">
                <p className="text-sm font-medium text-white">
                  {toast.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="inline-flex text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};