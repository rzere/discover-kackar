'use client';

import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'lg', 
  showText = false, 
  text = 'Loading...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src="/logos/logolar-02.png"
          alt="Discover Kaçkar"
          width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 80}
          height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 80}
          className="animate-pulse-scale"
          priority
        />
      </div>
      {showText && (
        <p className={`mt-4 text-gray-600 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}
