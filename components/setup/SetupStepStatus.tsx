'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetupStepStatusProps {
  isCompleted: boolean;
  title: string;
  className?: string;
}

export function SetupStepStatus({ isCompleted, title, className }: SetupStepStatusProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isCompleted ? (
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground" />
      )}
      <span 
        className={cn(
          "font-medium", 
          isCompleted 
            ? "text-green-600 dark:text-green-500" 
            : "text-muted-foreground"
        )}
      >
        {title}
      </span>
    </div>
  );
}