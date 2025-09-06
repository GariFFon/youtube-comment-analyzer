import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, HelpCircle, Laugh, Users, AlertTriangle, CheckCircle } from "lucide-react";
import type { Analysis } from "@/types/schema";

interface StatisticsOverviewProps {
  analysis: Analysis;
  video?: {
    commentCount: number | null;
  };
  fetchingStats?: {
    reportedCount: number;
    fetchedCount: number;
    missingCount: number;
    fetchSuccess: boolean;
  };
}

export function StatisticsOverview({ analysis, video, fetchingStats }: StatisticsOverviewProps) {
  const reportedComments = video?.commentCount || 0;
  const analyzedComments = analysis.totalComments;
  const missingComments = fetchingStats?.missingCount || Math.max(0, reportedComments - analyzedComments);
  const fetchSuccess = missingComments === 0;

  const stats = [
    {
      label: "Total Comments",
      value: analysis.totalComments.toLocaleString(),
      icon: MessageCircle,
      subtitle: reportedComments > 0 && missingComments > 0 
        ? `${missingComments} comments not fetched` 
        : "From analyzed comments"
    },
    {
      label: "Questions",
      value: analysis.questionsCount.toLocaleString(),
      icon: HelpCircle,
      subtitle: "From analyzed comments"
    },
    {
      label: "Jokes",
      value: analysis.jokesCount.toLocaleString(),
      icon: Laugh,
      subtitle: "From analyzed comments"
    },
    {
      label: "Discussions",
      value: analysis.discussionsCount.toLocaleString(),
      icon: Users,
      subtitle: "From analyzed comments"
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-white mb-4">Channel analytics</h2>
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Summary</h3>
          <p className="text-xs text-gray-400 mb-4">Last 28 days</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{stat.label}</span>
                  </div>
                  <div className="text-lg font-medium text-white">{stat.value}</div>
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="text-blue-400">{stat.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment Fetching Status - Integrated into YouTube Studio style */}
        {reportedComments > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {fetchSuccess ? (
                  <CheckCircle className="text-green-500 w-4 h-4" />
                ) : (
                  <AlertTriangle className="text-amber-500 w-4 h-4" />
                )}
                <h3 className="text-sm font-medium text-gray-300">Comment Fetching Status</h3>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                fetchSuccess ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'
              }`}>
                {Math.round((analyzedComments / reportedComments) * 100)}% Success
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-white">
                {fetchSuccess ? (
                  "✅ All comments successfully fetched and analyzed!"
                ) : (
                  `⚠️ ${missingComments} comments could not be fetched`
                )}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>📺 Reported: {reportedComments.toLocaleString()}</span>
                <span>💾 Fetched: {analyzedComments.toLocaleString()}</span>
                {!fetchSuccess && (
                  <span>❌ Missing: {missingComments.toLocaleString()}</span>
                )}
              </div>
              
              {!fetchSuccess && (
                <div className="mt-3 p-3 bg-amber-900/20 rounded-lg">
                  <p className="text-xs text-amber-300 mb-2">
                    📋 Possible reasons for missing comments:
                  </p>
                  <ul className="text-xs text-amber-400 space-y-1">
                    <li>• Some comments may be private or deleted</li>
                    <li>• Comments on replies might not be fully accessible</li>
                    <li>• YouTube API pagination limits</li>
                    <li>• Rate limiting or API quota restrictions</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
