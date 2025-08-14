import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, ThumbsUp, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Comment } from "@shared/schema";

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
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes" | "replies">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<"all" | "question" | "joke" | "discussion">("question");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["/api/search", videoId, debouncedQuery, category, sortBy, currentPage],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/search", {
        videoId,
        query: debouncedQuery || undefined,
        category,
        sortBy,
        page: currentPage,
        limit: 10,
      });
      return response.json();
    },
    enabled: !!videoId,
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      question: "bg-green-100 text-success hover:bg-green-200",
      joke: "bg-yellow-100 text-warning hover:bg-yellow-200", 
      discussion: "bg-blue-100 text-primary hover:bg-blue-200"
    };
    
    return (
      <Badge className={variants[category as keyof typeof variants] || variants.discussion}>
        {category}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading comments: {(error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle>Comments List</CardTitle>
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-80">
              <Input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={(value: any) => {
              setCategory(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="question">Questions</SelectItem>
                <SelectItem value="joke">Jokes</SelectItem>
                <SelectItem value="discussion">Discussions</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(value: any) => {
              setSortBy(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-32">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            <p className="text-gray-500">Loading comments...</p>
          </div>
        ) : !data?.comments.length ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No comments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Replies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.comments.map((comment) => (
                    <TableRow key={comment.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-3">
                            {getInitials(comment.authorDisplayName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {comment.authorDisplayName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                          {comment.textDisplay}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(comment.category)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatTimeAgo(comment.publishedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {comment.likeCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {comment.replyCount || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data.pagination.total > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{((data.pagination.page - 1) * data.pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{data.pagination.total}</span> comments
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={!data.pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {data.pagination.totalPages > 5 && (
                    <>
                      <span className="text-gray-500">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(data.pagination.totalPages)}
                        className="w-10"
                      >
                        {data.pagination.totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!data.pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
