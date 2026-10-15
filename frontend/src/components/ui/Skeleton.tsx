import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse rounded-xl bg-surface-secondary/80 border border-muted-border/40',
          className
        )
      )}
      {...props}
    />
  );
};
