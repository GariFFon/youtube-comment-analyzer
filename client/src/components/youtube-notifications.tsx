import { useEffect, useState } from "react";
import { Bell, ThumbsUp, MessageCircle, UserPlus, TrendingUp, Eye } from "lucide-react";

interface YouTubeNotification {
  id: number;
  type: 'like' | 'comment' | 'subscribe' | 'trending' | 'milestone';
  icon: React.ReactNode;
  title: string;
  message: string;
  timestamp: string;
  delay: number;
}

export function YouTubeNotifications() {
  const [notifications, setNotifications] = useState<YouTubeNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<YouTubeNotification | null>(null);

  const notificationTemplates = [
    {
      type: 'like' as const,
      icon: <ThumbsUp className="w-4 h-4" />,
      title: 'New Like',
      message: 'Someone liked your comment analysis!',
      timestamp: 'just now'
    },
    {
      type: 'comment' as const,
      icon: <MessageCircle className="w-4 h-4" />,
      title: 'New Comment',
      message: 'Video has 50+ new comments to analyze',
      timestamp: '2m ago'
    },
    {
      type: 'subscribe' as const,
      icon: <UserPlus className="w-4 h-4" />,
      title: 'Channel Update',
      message: 'Creator uploaded a new video',
      timestamp: '5m ago'
    },
    {
      type: 'trending' as const,
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'Trending Topic',
      message: 'Your analyzed video is trending!',
      timestamp: '1h ago'
    },
    {
      type: 'milestone' as const,
      icon: <Eye className="w-4 h-4" />,
      title: 'Milestone Reached',
      message: 'Video reached 1M views!',
      timestamp: '3h ago'
    }
  ];

  useEffect(() => {
    const generateNotifications = () => {
      return notificationTemplates.map((template, index) => ({
        id: index,
        ...template,
        delay: index * 8000 + Math.random() * 5000 // Random delay between 0-5s, spaced 8s apart
      }));
    };

    setNotifications(generateNotifications());
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        setActiveNotification(notification);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
          setActiveNotification(null);
        }, 4000);
      }, notification.delay);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  if (!activeNotification) return null;

  return (
    <div className="fixed top-20 right-4 z-40 pointer-events-none">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm animate-[slideInRight_0.5s_ease-out] opacity-90">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-youtube-gradient rounded-full flex items-center justify-center text-white">
              {activeNotification.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activeNotification.title}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activeNotification.timestamp}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {activeNotification.message}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Bell className="w-4 h-4 text-gray-400 animate-pulse" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div className="bg-youtube-gradient h-1 rounded-full animate-[progressBar_4s_linear_forwards]"></div>
        </div>
      </div>
    </div>
  );
}

export function YouTubeActivityFeed() {
  const activities = [
    { icon: <ThumbsUp className="w-3 h-3" />, text: "1.2K likes", color: "text-blue-500" },
    { icon: <MessageCircle className="w-3 h-3" />, text: "234 comments", color: "text-green-500" },
    { icon: <UserPlus className="w-3 h-3" />, text: "+15 subscribers", color: "text-purple-500" },
    { icon: <Eye className="w-3 h-3" />, text: "50K views", color: "text-orange-500" },
    { icon: <TrendingUp className="w-3 h-3" />, text: "#3 trending", color: "text-red-500" },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-30 pointer-events-none opacity-60">
      <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 dark:border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Live Activity</span>
        </div>
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 text-xs animate-[fadeInFloat_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className={activity.color}>
                {activity.icon}
              </div>
              <span className="text-gray-600 dark:text-gray-300">{activity.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
