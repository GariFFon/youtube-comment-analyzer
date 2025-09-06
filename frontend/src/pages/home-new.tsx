import { useState } from "react";
import { VideoInputForm } from "@/components/video-input-form";
import { VideoInfo } from "@/components/video-info";
import { StatisticsOverview } from "@/components/statistics-overview";
import { ChartsSection } from "@/components/charts-section";
import { QuestionsTable } from "@/components/questions-table";
import { ExportOptions } from "@/components/export-options";
import { YouTubeStudioHeader } from "@/components/youtube-studio-header";
import { YouTubeStudioSidebar } from "@/components/youtube-studio-sidebar";
import { Upload } from "lucide-react";
import type { Video, Analysis } from "@/types/schema";

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAnalysisComplete = (video: Video, analysis: Analysis) => {
    console.log('Analysis complete callback called:', { video, analysis });
    setCurrentVideo(video);
    setCurrentAnalysis(analysis);
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
          <div className="p-6">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-white mb-2">
                Channel dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Analyze YouTube video comments with AI-powered insights
              </p>
            </div>

            {/* Video Input Form */}
            <div className="mb-8">
              <VideoInputForm onAnalysisComplete={handleAnalysisComplete} />
            </div>

            {/* Results Section - Only show when we have analysis */}
            {currentVideo && currentAnalysis ? (
              <div className="space-y-6">
                {/* Video Info */}
                <VideoInfo video={currentVideo} />

                {/* Statistics Overview */}
                <StatisticsOverview analysis={currentAnalysis} />

                {/* Charts Section */}
                <ChartsSection analysis={currentAnalysis} />

                {/* Questions Table */}
                <QuestionsTable videoId={currentVideo.id} />

                {/* Export Options */}
                <ExportOptions />
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a1a1a] rounded-full mb-6">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Want to see metrics on your recent video?
                </h3>
                <p className="text-gray-400 mb-6">
                  Upload and analyze a video to get started.
                </p>
                <button className="bg-white text-black px-6 py-2 rounded-sm font-medium hover:bg-gray-100 transition-colors">
                  Analyze Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
