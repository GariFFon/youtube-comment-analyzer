import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageCircle, Clock } from "lucide-react";
import type { Video } from "@/types/schema";

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
    <div className="mb-8">
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img 
              src={video.thumbnailUrl || 'https://via.placeholder.com/160x90?text=No+Thumbnail'} 
              alt="Video thumbnail" 
              className="w-40 h-24 object-cover rounded bg-gray-800"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-gray-400 mb-3">
              <span>{video.channelTitle}</span>
              <span>•</span>
              <span>{formatViews(video.viewCount || 0)} views</span>
              <span>•</span>
              <span>{getRelativeTime(video.publishedAt || null)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-300">
                <MessageCircle className="h-4 w-4" />
                <span>{(video.commentCount || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(video.duration || 'PT0S')}</span>
              </div>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
