import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ThumbsUp, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Comment } from "@/types/schema";

interface QuestionsTableProps {
  videoId: string;
}

interface SearchResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function QuestionsTable({ videoId }: QuestionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<"all" | "question" | "joke" | "discussion">("question");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["/api/search", videoId, debouncedQuery, category, currentPage],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/search", {
        videoId,
        query: debouncedQuery || undefined,
        category: category === "all" ? undefined : category,
        sortBy: "newest",
        page: currentPage,
        limit: 10,
      });
      return response.json();
    },
    enabled: !!videoId,
  });

  if (error) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
        <p className="text-red-400">Error loading comments: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Comments</h3>
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0f0f0f] border border-gray-600 rounded pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none w-64"
                />
              </div>
              
              {/* Filter */}
              <Select value={category} onValueChange={(value: any) => {
                setCategory(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-40 bg-[#0f0f0f] border-gray-600 text-white hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-colors">
                  <SelectValue placeholder="Select category" className="text-white font-medium" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-gray-600 shadow-xl">
                  <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">All Comments</SelectItem>
                  <SelectItem value="question" className="text-blue-400 hover:bg-blue-900/30 focus:bg-blue-900/30">Questions</SelectItem>
                  <SelectItem value="joke" className="text-yellow-400 hover:bg-yellow-900/30 focus:bg-yellow-900/30">Jokes</SelectItem>
                  <SelectItem value="discussion" className="text-purple-400 hover:bg-purple-900/30 focus:bg-purple-900/30">Discussions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Loading comments...</p>
            </div>
          ) : data?.comments?.length ? (
            data.comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {comment.authorDisplayName?.[0] || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        {comment.authorDisplayName || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.publishedAt).toLocaleDateString()}
                      </span>
                      {comment.category && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          comment.category === 'question' ? 'bg-blue-900/30 text-blue-400' :
                          comment.category === 'joke' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-purple-900/30 text-purple-400'
                        }`}>
                          {comment.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {comment.textDisplay}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likeCount || 0}</span>
                      </div>
                      {(comment.replyCount || 0) > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MessageCircle className="w-3 h-3" />
                          <span>{comment.replyCount} replies</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-400">No comments found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
            </p>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!data.pagination.hasPrev}
                variant="outline"
                size="sm"
                className="bg-[#0f0f0f] border-gray-600 text-white hover:bg-gray-800"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!data.pagination.hasNext}
                variant="outline"
                size="sm"
                className="bg-[#0f0f0f] border-gray-600 text-white hover:bg-gray-800"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
