import { Youtube, Play } from "lucide-react";

interface YouTubeLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function YouTubeLoader({ size = 'md', message = 'Loading...' }: YouTubeLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* YouTube Play Button Loader */}
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-youtube-gradient rounded-full flex items-center justify-center shadow-lg relative overflow-hidden`}>
          <Play className="text-white fill-current animate-pulse" />
          
          {/* Loading ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/50 animate-spin"></div>
        </div>
        
        {/* Pulsing effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-youtube-500/20 rounded-full animate-ping`}></div>
      </div>
      
      {/* Loading text with typewriter effect */}
      <div className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
        <span className="inline-block animate-pulse">{message}</span>
        <span className="animate-bounce ml-1">...</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-youtube-gradient rounded-full animate-[progressBar_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}

export function YouTubeSkeletonCard() {
  return (
    <div className="bg-card-gradient rounded-lg p-4 space-y-3">
      {/* Video thumbnail skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg video-skeleton relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white/40" />
          </div>
        </div>
      </div>
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded video-skeleton"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 video-skeleton"></div>
      </div>
      
      {/* Stats skeleton */}
      <div className="flex items-center space-x-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 video-skeleton"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 video-skeleton"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 video-skeleton"></div>
      </div>
    </div>
  );
}

export function YouTubeCommentSkeleton() {
  return (
    <div className="flex space-x-3 p-3 bg-card-gradient rounded-lg">
      {/* Avatar */}
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full video-skeleton flex-shrink-0"></div>
      
      {/* Comment content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 video-skeleton"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 video-skeleton"></div>
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded video-skeleton"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5 video-skeleton"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8 video-skeleton"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8 video-skeleton"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10 video-skeleton"></div>
        </div>
      </div>
    </div>
  );
}
