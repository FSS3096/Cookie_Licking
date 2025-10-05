import React from 'react';

interface LoadingProps {
  text?: string;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  overlay = false,
  size = 'md',
}) => {
  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinner = (
    <div className="flex items-center justify-center flex-col">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${spinnerSizes[size]}`}
      ></div>
      {text && (
        <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};