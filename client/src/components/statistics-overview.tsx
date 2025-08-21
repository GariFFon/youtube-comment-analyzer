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
      color: "youtube",
      bgColor: "bg-youtube-50 dark:bg-youtube-900/20",
      iconColor: "text-youtube-500",
    },
    {
      label: "Questions",
      value: analysis.questionsCount.toLocaleString(),
      icon: HelpCircle,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500",
    },
    {
      label: "Jokes",
      value: analysis.jokesCount.toLocaleString(),
      icon: Laugh,
      color: "amber",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500",
    },
    {
      label: "Discussions",
      value: analysis.discussionsCount.toLocaleString(),
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="relative group">
            <div className="absolute inset-0 bg-card-gradient rounded-2xl transform rotate-1 opacity-50 group-hover:rotate-2 transition-transform duration-200"></div>
            <Card className="relative bg-card-gradient border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200">
              <div className={`absolute top-0 left-0 w-full h-1 ${stat.color === 'youtube' ? 'bg-youtube-gradient' : `bg-${stat.color}-500`}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className={`${stat.iconColor} text-xl`} />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-2 h-2 ${stat.color === 'youtube' ? 'bg-youtube-500' : `bg-${stat.color}-500`} rounded-full mr-2 animate-pulse`}></div>
                    From analyzed comments
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
