import React from 'react';
import { cn } from '@/lib/utils';
interface SketchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}
export const SketchCard = React.forwardRef<HTMLDivElement, SketchCardProps>(
  ({ className, children, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'sketch-card bg-white p-4 transition-all duration-200',
          hover && 'hover:-translate-y-1 hover:shadow-sketch-lg cursor-default',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SketchCard.displayName = 'SketchCard';