import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface FormAlertProps {
  type: AlertType;
  message: ReactNode | null;
  className?: string;
}

const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-100 border-l-4 border-green-500 text-green-700',
  error: 'bg-red-100 border-l-4 border-red-500 text-red-700',
  warning: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
  info: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700',
};

const textStyles: Record<AlertType, string> = {
  success: 'text-green-700',
  error: 'text-red-700',
  warning: 'text-yellow-700',
  info: 'text-blue-700',
};

export default function FormAlert({ type, message, className }: FormAlertProps) {
  if (!message) return null;
  
  return (
    <div className={cn('p-4', alertStyles[type], className)}>
      {typeof message === 'string' ? (
        <p className={textStyles[type]}>{message}</p>
      ) : (
        <div className={textStyles[type]}>{message}</div>
      )}
    </div>
  );
}