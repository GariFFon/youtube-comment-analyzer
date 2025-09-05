import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, HelpCircle, Laugh, Users } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface StatisticsOverviewProps {
  analysis: Analysis;
}

export function StatisticsOverview({ analysis }: StatisticsOverviewProps) {
  const stats = [
    {
      label: "Total Comments",
      value: analysis.totalComments.toLocaleString(),
      icon: MessageCircle,
      change: "+12%",
    },
    {
      label: "Questions",
      value: analysis.questionsCount.toLocaleString(),
      icon: HelpCircle,
      change: "+8%",
    },
    {
      label: "Jokes",
      value: analysis.jokesCount.toLocaleString(),
      icon: Laugh,
      change: "+15%",
    },
    {
      label: "Discussions",
      value: analysis.discussionsCount.toLocaleString(),
      icon: Users,
      change: "+5%",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-white mb-4">Channel analytics</h2>
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Current subscribers</h3>
          <div className="text-2xl font-medium text-white">0</div>
        </div>
        
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
                    <span className="text-green-400">{stat.change}</span>
                    <span className="ml-1">vs previous period</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-300">Views</p>
              <p className="text-lg font-medium text-white">17</p>
              <p className="text-xs text-gray-400">—</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Watch time (hours)</p>
              <p className="text-lg font-medium text-white">0.1</p>
              <p className="text-xs text-gray-400">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
