import { useState } from "react";
import { YouTubeStudioHeader } from "@/components/youtube-studio-header";
import { YouTubeStudioSidebar } from "@/components/youtube-studio-sidebar";
import { YouTubeStudioDashboard } from "@/components/youtube-studio-dashboard";
import type { Video, Analysis } from "@/types/schema";

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fetchingStats, setFetchingStats] = useState<any>(null);

  const handleAnalysisComplete = (video: Video, analysis: Analysis, stats?: any) => {
    console.log('Analysis complete callback called:', { video, analysis, stats });
    setCurrentVideo(video);
    setCurrentAnalysis(analysis);
    setFetchingStats(stats);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* YouTube Studio Header */}
      <YouTubeStudioHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* YouTube Studio Sidebar */}
        <YouTubeStudioSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <YouTubeStudioDashboard 
            currentVideo={currentVideo}
            currentAnalysis={currentAnalysis}
            fetchingStats={fetchingStats}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      </div>
    </div>
  );
}
