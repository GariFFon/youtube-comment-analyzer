import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageCircle, Clock } from "lucide-react";
import type { Video } from "@shared/schema";

interface VideoInfoProps {
  video: Video;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration (PT3H24M17S) to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRelativeTime = (date: Date | string | null) => {
    if (!date) return 'Unknown date';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-card-gradient rounded-2xl transform -rotate-1"></div>
      <Card className="relative bg-card-gradient border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-youtube-gradient"></div>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="relative group flex-shrink-0">
              <img 
                src={video.thumbnailUrl || 'https://via.placeholder.com/300x200?text=No+Thumbnail'} 
                alt="Video thumbnail" 
                className="w-40 h-24 object-cover rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-youtube-500 border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                {video.title}
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  {video.channelTitle}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatViews(video.viewCount || 0)} views
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getRelativeTime(video.publishedAt)}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-youtube-50 dark:bg-youtube-900/20 px-3 py-2 rounded-lg">
                  <MessageCircle className="h-4 w-4 mr-2 text-youtube-500" />
                  <span className="text-sm font-semibold text-youtube-700 dark:text-youtube-300">
                    {(video.commentCount || 0).toLocaleString()} comments
                  </span>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {formatDuration(video.duration || 'PT0S')}
                  </span>
                </div>
              </div>
            </div>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-youtube-500 flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              title="Open on YouTube"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
