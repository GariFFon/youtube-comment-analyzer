import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  type: 'play' | 'thumbnail' | 'like' | 'subscribe';
  left: number;
  delay: number;
  duration: number;
}

export function YouTubeBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate floating elements
    const newElements: FloatingElement[] = [];
    
    // Play icons
    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: i,
        type: 'play',
        left: 10 + (i * 10),
        delay: i * 2,
        duration: 15 + Math.random() * 10
      });
    }
    
    // Thumbnails
    for (let i = 0; i < 5; i++) {
      newElements.push({
        id: i + 20,
        type: 'thumbnail',
        left: Math.random() * 80,
        delay: i * 5,
        duration: 20 + Math.random() * 10
      });
    }
    
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* YouTube Pattern Background */}
      <div className="youtube-pattern absolute inset-0" />
      
      {/* YouTube Grid */}
      <div className="youtube-grid absolute inset-0" />
      
      {/* Floating Play Icons */}
      <div className="floating-play-icons">
        {Array.from({ length: 9 }, (_, i) => (
          <div 
            key={`play-${i}`}
            className="play-icon"
            style={{
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${18 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating Thumbnails */}
      <div className="floating-thumbnails">
        {Array.from({ length: 5 }, (_, i) => (
          <div 
            key={`thumb-${i}`}
            className="thumbnail"
            style={{
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating YouTube Icons */}
      <div className="absolute inset-0">
        {/* Subscribe Button Effects */}
        <div 
          className="absolute opacity-5 text-youtube-500"
          style={{
            top: '20%',
            left: '5%',
            animation: 'float-up 30s infinite linear',
            animationDelay: '5s'
          }}
        >
          <div className="bg-youtube-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            SUBSCRIBE
          </div>
        </div>
        
        <div 
          className="absolute opacity-5 text-youtube-500"
          style={{
            top: '60%',
            right: '5%',
            animation: 'float-up 35s infinite linear',
            animationDelay: '15s'
          }}
        >
          <div className="bg-youtube-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            SUBSCRIBE
          </div>
        </div>
        
        {/* Like/Dislike Icons */}
        <div 
          className="absolute opacity-10"
          style={{
            top: '30%',
            left: '15%',
            animation: 'float-diagonal 25s infinite linear',
            animationDelay: '8s'
          }}
        >
          <div className="flex items-center space-x-2 bg-white/50 dark:bg-black/30 rounded-full px-3 py-2">
            <svg className="w-4 h-4 text-youtube-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">1.2K</span>
          </div>
        </div>
        
        <div 
          className="absolute opacity-10"
          style={{
            top: '70%',
            right: '15%',
            animation: 'float-diagonal 20s infinite linear',
            animationDelay: '12s'
          }}
        >
          <div className="flex items-center space-x-2 bg-white/50 dark:bg-black/30 rounded-full px-3 py-2">
            <svg className="w-4 h-4 text-youtube-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">856</span>
          </div>
        </div>
        
        {/* View Count Bubbles */}
        <div 
          className="absolute opacity-5"
          style={{
            top: '40%',
            left: '25%',
            animation: 'float-up 28s infinite linear',
            animationDelay: '3s'
          }}
        >
          <div className="bg-black/20 dark:bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium">
            1.2M views
          </div>
        </div>
        
        <div 
          className="absolute opacity-5"
          style={{
            top: '80%',
            left: '60%',
            animation: 'float-up 32s infinite linear',
            animationDelay: '18s'
          }}
        >
          <div className="bg-black/20 dark:bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium">
            856K views
          </div>
        </div>
        
        {/* Comment Icons */}
        <div 
          className="absolute opacity-5"
          style={{
            top: '15%',
            right: '25%',
            animation: 'float-diagonal 22s infinite linear',
            animationDelay: '6s'
          }}
        >
          <div className="flex items-center space-x-1 bg-white/30 dark:bg-black/20 rounded-full px-2 py-1">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            <span className="text-xs text-gray-500">234</span>
          </div>
        </div>
      </div>
      
      {/* Subtle Moving Dots */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute w-1 h-1 bg-youtube-500/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-up ${20 + Math.random() * 15}s infinite linear`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
