import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface FormAlertProps {
  type: AlertType;
  message: ReactNode | null;
  className?: string;
}

const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300',
  error: 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300',
  info: 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300',
};

const textStyles: Record<AlertType, string> = {
  success: 'text-green-700 dark:text-green-300',
  error: 'text-red-700 dark:text-red-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
  info: 'text-blue-700 dark:text-blue-300',
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