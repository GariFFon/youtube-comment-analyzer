import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
    <div className="mb-8">
      <h2 className="text-lg font-medium text-white mb-4">Comment Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
          <h3 className="text-base font-medium text-white mb-4">Comment Categories</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${calculatePercentage(value)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} comments (${calculatePercentage(value)}%)`, name]}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Keywords */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
          <h3 className="text-base font-medium text-white mb-4">Top Keywords</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="word" 
                  stroke="#9ca3af"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
