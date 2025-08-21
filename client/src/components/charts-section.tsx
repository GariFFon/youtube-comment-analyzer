import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Analysis } from "@shared/schema";

interface ChartsSectionProps {
  analysis: Analysis;
}

export function ChartsSection({ analysis }: ChartsSectionProps) {
  const categoryData = [
    { name: 'Questions', value: analysis.questionsCount, color: '#3b82f6' },
    { name: 'Jokes', value: analysis.jokesCount, color: '#f59e0b' },
    { name: 'Discussions', value: analysis.discussionsCount, color: '#8b5cf6' },
  ];

  const topWordsData = (analysis.topWords as Array<{word: string, count: number}>)
    .slice(0, 6)
    .map(item => ({
      word: item.word,
      count: item.count,
    }));

  const calculatePercentage = (value: number) => {
    return ((value / analysis.totalComments) * 100).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Category Distribution Chart */}
      <div className="relative">
        <div className="absolute inset-0 bg-card-gradient rounded-2xl transform rotate-1"></div>
        <Card className="relative bg-card-gradient border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-purple-500"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <div className="w-6 h-6 bg-youtube-gradient rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span>Comment Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Comments']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Questions</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{calculatePercentage(analysis.questionsCount)}%</p>
              </div>
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="w-4 h-4 bg-amber-500 rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Jokes</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{calculatePercentage(analysis.jokesCount)}%</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Discussions</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{calculatePercentage(analysis.discussionsCount)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Keywords Chart */}
      <div className="relative">
        <div className="absolute inset-0 bg-card-gradient rounded-2xl transform -rotate-1"></div>
        <Card className="relative bg-card-gradient border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-youtube-gradient"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-youtube-500 to-youtube-600 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded transform rotate-45"></div>
              </div>
              <span>Top Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topWordsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="word" 
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} fontWeight={500} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Occurrences']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#youtubeGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="youtubeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff0000" />
                      <stop offset="100%" stopColor="#cc0000" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Top 3 Keywords
              </h4>
              {(analysis.topWords as Array<{word: string, count: number}>)
                .slice(0, 3)
                .map((item, index) => (
                  <div key={item.word} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-youtube-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.word}</span>
                    </div>
                    <span className="font-bold text-youtube-500">{item.count.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
