import { useState } from "react";
import { VideoInputForm } from "@/components/video-input-form";
import { VideoInfo } from "@/components/video-info";
import { StatisticsOverview } from "@/components/statistics-overview";
import { ChartsSection } from "@/components/charts-section";
import { QuestionsTable } from "@/components/questions-table";
import { ExportOptions } from "@/components/export-options";
import { Upload } from "lucide-react";
import type { Video, Analysis } from "@/types/schema";

interface YouTubeStudioDashboardProps {
  currentVideo: Video | null;
  currentAnalysis: Analysis | null;
  fetchingStats: any;
  onAnalysisComplete: (video: Video, analysis: Analysis, fetchingStats?: any) => void;
}

export function YouTubeStudioDashboard({ 
  currentVideo, 
  currentAnalysis, 
  fetchingStats,
  onAnalysisComplete 
}: YouTubeStudioDashboardProps) {
  return (
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
        <VideoInputForm onAnalysisComplete={onAnalysisComplete} />
      </div>

      {/* Results Section - Only show when we have analysis */}
      {currentVideo && currentAnalysis ? (
        <div className="space-y-6">
          {/* Video Info */}
          <VideoInfo video={currentVideo} />

          {/* Statistics Overview with fetchingStats */}
          <StatisticsOverview 
            analysis={currentAnalysis} 
            video={{ commentCount: currentVideo.commentCount ?? null }}
            fetchingStats={fetchingStats}
          />

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
  );
}
