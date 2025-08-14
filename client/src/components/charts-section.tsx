import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Analysis } from "@shared/schema";

interface ChartsSectionProps {
  analysis: Analysis;
}

export function ChartsSection({ analysis }: ChartsSectionProps) {
  const categoryData = [
    { name: 'Questions', value: analysis.questionsCount, color: 'var(--success)' },
    { name: 'Jokes', value: analysis.jokesCount, color: 'var(--warning)' },
    { name: 'Discussions', value: analysis.discussionsCount, color: 'var(--primary)' },
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Category Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comment Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Comments']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-3 h-3 bg-success rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-500">Questions</p>
              <p className="text-sm font-medium">{calculatePercentage(analysis.questionsCount)}%</p>
            </div>
            <div>
              <div className="w-3 h-3 bg-warning rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-500">Jokes</p>
              <p className="text-sm font-medium">{calculatePercentage(analysis.jokesCount)}%</p>
            </div>
            <div>
              <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-500">Discussions</p>
              <p className="text-sm font-medium">{calculatePercentage(analysis.discussionsCount)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Keywords Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="word" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), 'Occurrences']}
                  labelStyle={{ color: '#333' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {(analysis.topWords as Array<{word: string, count: number}>)
              .slice(0, 3)
              .map((item, index) => (
                <div key={item.word} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.word}</span>
                  <span className="font-medium">{item.count.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
