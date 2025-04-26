import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      
      {description && (
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}