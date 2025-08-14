import { useState } from "react";
import { VideoInputForm } from "@/components/video-input-form";
import { VideoInfo } from "@/components/video-info";
import { StatisticsOverview } from "@/components/statistics-overview";
import { ChartsSection } from "@/components/charts-section";
import { QuestionsTable } from "@/components/questions-table";
import { ExportOptions } from "@/components/export-options";
import { Youtube, HelpCircle, Settings } from "lucide-react";
import type { Video, Analysis } from "@shared/schema";

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);

  const handleAnalysisComplete = (video: Video, analysis: Analysis) => {
    setCurrentVideo(video);
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Youtube className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  YouTube Comments Analyzer
                </h1>
                <p className="text-sm text-gray-500">
                  Analyze and categorize YouTube video comments
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Video Input Form */}
        <VideoInputForm onAnalysisComplete={handleAnalysisComplete} />

        {/* Results Section - Only show when we have analysis */}
        {currentVideo && currentAnalysis && (
          <>
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
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2024 YouTube Comments Analyzer. Built with React & YouTube Data API.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Documentation</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
