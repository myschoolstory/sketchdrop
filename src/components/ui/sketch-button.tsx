import React from 'react';
import { cn } from '@/lib/utils';
interface SketchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}
export const SketchButton = React.forwardRef<HTMLButtonElement, SketchButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-sketch-yellow hover:bg-yellow-400',
      secondary: 'bg-white hover:bg-gray-50',
      accent: 'bg-sketch-pink text-white hover:bg-rose-500',
    };
    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'sketch-card font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-sketch-sm inline-flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
SketchButton.displayName = 'SketchButton';