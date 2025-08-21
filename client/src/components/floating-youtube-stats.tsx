import { useEffect, useState } from "react";
import { TrendingUp, Users, Eye, MessageCircle, ThumbsUp, Share, Clock } from "lucide-react";

interface FloatingStats {
  id: number;
  icon: React.ReactNode;
  value: string;
  label: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export function FloatingYouTubeStats() {
  const [stats, setStats] = useState<FloatingStats[]>([]);

  useEffect(() => {
    const generateStats = (): FloatingStats[] => {
      const icons = [
        { icon: <Eye className="w-3 h-3" />, value: "1.2M", label: "views" },
        { icon: <Users className="w-3 h-3" />, value: "45.2K", label: "subscribers" },
        { icon: <ThumbsUp className="w-3 h-3" />, value: "12.8K", label: "likes" },
        { icon: <MessageCircle className="w-3 h-3" />, value: "1.1K", label: "comments" },
        { icon: <Share className="w-3 h-3" />, value: "892", label: "shares" },
        { icon: <TrendingUp className="w-3 h-3" />, value: "+15%", label: "growth" },
        { icon: <Clock className="w-3 h-3" />, value: "2h", label: "ago" },
      ];

      return Array.from({ length: 12 }, (_, i) => {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        return {
          id: i,
          icon: randomIcon.icon,
          value: randomIcon.value,
          label: randomIcon.label,
          x: Math.random() * 80 + 10, // 10% to 90% of screen width
          y: Math.random() * 80 + 10, // 10% to 90% of screen height
          delay: Math.random() * 10,
          duration: 15 + Math.random() * 20,
        };
      });
    };

    setStats(generateStats());

    // Regenerate stats every 30 seconds
    const interval = setInterval(() => {
      setStats(generateStats());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="absolute opacity-0 animate-[fadeInFloat_var(--duration)_ease-in-out_infinite] transform-gpu"
          style={{
            left: `${stat.x}%`,
            top: `${stat.y}%`,
            animationDelay: `${stat.delay}s`,
            animationDuration: `${stat.duration}s`,
            '--duration': `${stat.duration}s`,
          } as React.CSSProperties}
        >
          <div className="flex items-center space-x-2 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-white/20 dark:border-white/10">
            <div className="text-youtube-500 flex-shrink-0">
              {stat.icon}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {stat.value}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Floating YouTube Progress Bars */}
      <div className="absolute top-1/4 left-1/4 opacity-5">
        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-youtube-500 rounded-full animate-[progressBar_8s_ease-in-out_infinite]"
            style={{ width: '0%' }}
          />
        </div>
      </div>
      
      <div className="absolute top-3/4 right-1/4 opacity-5">
        <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-youtube-500 rounded-full animate-[progressBar_6s_ease-in-out_infinite]"
            style={{ width: '0%', animationDelay: '2s' }}
          />
        </div>
      </div>
      
      {/* Floating Subscriber Notifications */}
      <div className="absolute top-1/3 right-1/6 opacity-10">
        <div className="bg-youtube-500 text-white px-4 py-2 rounded-lg shadow-lg animate-[slideInRight_4s_ease-in-out_infinite] transform">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-youtube-500" />
            </div>
            <div className="text-sm">
              <div className="font-semibold">+1 Subscriber</div>
              <div className="text-xs opacity-80">John Doe</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Video Duration Tags */}
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={`duration-${i}`}
          className="absolute opacity-5"
          style={{
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float-up ${25 + i * 3}s infinite linear`,
            animationDelay: `${i * 4}s`
          }}
        >
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
            {['4:23', '12:45', '8:17', '15:32', '6:09', '21:44'][i]}
          </div>
        </div>
      ))}
      
      {/* Floating Quality Badges */}
      {['HD', '4K', '1080p', '720p'].map((quality, i) => (
        <div
          key={`quality-${i}`}
          className="absolute opacity-5"
          style={{
            right: `${10 + i * 15}%`,
            top: `${30 + i * 10}%`,
            animation: `float-diagonal ${20 + i * 2}s infinite linear`,
            animationDelay: `${i * 3}s`
          }}
        >
          <div className="bg-youtube-500 text-white px-2 py-1 rounded text-xs font-bold">
            {quality}
          </div>
        </div>
      ))}
    </div>
  );
}

// Add these keyframes to the CSS
const additionalStyles = `
  @keyframes fadeInFloat {
    0% { 
      opacity: 0; 
      transform: translateY(20px) scale(0.8); 
    }
    15% { 
      opacity: 0.8; 
      transform: translateY(0) scale(1); 
    }
    85% { 
      opacity: 0.8; 
      transform: translateY(0) scale(1); 
    }
    100% { 
      opacity: 0; 
      transform: translateY(-20px) scale(0.8); 
    }
  }
  
  @keyframes progressBar {
    0% { width: 0%; }
    50% { width: 75%; }
    100% { width: 100%; }
  }
  
  @keyframes slideInRight {
    0% { 
      transform: translateX(100px); 
      opacity: 0; 
    }
    25% { 
      transform: translateX(0); 
      opacity: 1; 
    }
    75% { 
      transform: translateX(0); 
      opacity: 1; 
    }
    100% { 
      transform: translateX(-100px); 
      opacity: 0; 
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}
