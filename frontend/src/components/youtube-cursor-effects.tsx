import { useEffect, useState } from "react";

interface CursorTrail {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function YouTubeCursorEffects() {
  const [trail, setTrail] = useState<CursorTrail[]>([]);

  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail: CursorTrail = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };
      
      setTrail(prev => [...prev, newTrail].slice(-8)); // Keep last 8 trail points
    };

    const updateTrail = () => {
      setTrail(prev => prev.filter(point => Date.now() - point.timestamp < 500));
      animationFrame = requestAnimationFrame(updateTrail);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrame = requestAnimationFrame(updateTrail);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="absolute w-2 h-2 bg-youtube-500/30 rounded-full transform -translate-x-1 -translate-y-1"
          style={{
            left: point.x,
            top: point.y,
            opacity: (index + 1) / trail.length * 0.6,
            transform: `translate(-50%, -50%) scale(${(index + 1) / trail.length})`,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
          }}
        />
      ))}
    </div>
  );
}

export function YouTubeAmbientEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-youtube-500/5 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-youtube-500/3 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite] delay-4000ms"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-youtube-500/2 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite] delay-2000ms"></div>
      
      {/* Subtle scanlines effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-youtube-500/10 to-transparent animate-[scanlines_15s_linear_infinite]"></div>
      </div>
      
      {/* Corner accent lights */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-youtube-500/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-youtube-500/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-youtube-500/10 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-youtube-500/10 to-transparent"></div>
    </div>
  );
}
