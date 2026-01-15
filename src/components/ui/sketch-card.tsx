import React from 'react';
import { cn } from '@/lib/utils';
interface SketchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const SketchCard = React.forwardRef<HTMLDivElement, SketchCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'sketch-card bg-white p-4',
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