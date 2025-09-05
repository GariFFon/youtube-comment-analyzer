import { z } from "zod";

// Data types for in-memory storage
export interface Video {
  id: string;
  url: string;
  title: string;
  channelTitle: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  viewCount?: number | null;
  likeCount?: number | null;
  commentCount?: number | null;
  duration?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
}

export interface Comment {
  id: string;
  videoId: string;
  authorDisplayName: string;
  authorProfileImageUrl?: string | null;
  textDisplay: string;
  textOriginal: string;
  likeCount?: number | null;
  replyCount?: number | null;
  publishedAt: Date;
  updatedAt?: Date | null;
  parentId?: string | null;
  category: string; // 'question', 'joke', 'discussion', 'positive', 'negative', 'neutral', 'spam'
  sentiment?: string | null; // 'positive', 'negative', 'neutral'
  topics?: string[] | null;
  aiConfidence?: number | null; // 0-100
  aiReasoning?: string | null;
  isAiAnalyzed?: boolean;
}

export interface Analysis {
  id: string;
  videoId: string;
  totalComments: number;
  questionsCount: number;
  jokesCount: number;
  discussionsCount: number;
  positiveCount?: number;
  negativeCount?: number;
  neutralCount?: number;
  spamCount?: number;
  topWords: Array<{word: string, count: number}>;
  topTopics?: string[] | null;
  aiSummary?: string | null;
  isAiAnalyzed?: boolean;
  createdAt: Date;
}

// Input schemas for creating new records
export const insertVideoSchema = z.object({
  url: z.string(),
  title: z.string(),
  channelTitle: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  viewCount: z.number().optional(),
  likeCount: z.number().optional(),
  commentCount: z.number().optional(),
  duration: z.string().optional(),
  publishedAt: z.date().optional(),
});

export const insertCommentSchema = z.object({
  videoId: z.string(),
  authorDisplayName: z.string(),
  authorProfileImageUrl: z.string().optional(),
  textDisplay: z.string(),
  textOriginal: z.string(),
  likeCount: z.number().optional(),
  replyCount: z.number().optional(),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  parentId: z.string().optional(),
  category: z.string(),
  sentiment: z.string().optional(),
  topics: z.array(z.string()).optional(),
  aiConfidence: z.number().optional(),
  aiReasoning: z.string().optional(),
  isAiAnalyzed: z.boolean().optional(),
});

export const insertAnalysisSchema = z.object({
  videoId: z.string(),
  totalComments: z.number(),
  questionsCount: z.number(),
  jokesCount: z.number(),
  discussionsCount: z.number(),
  positiveCount: z.number().optional(),
  negativeCount: z.number().optional(),
  neutralCount: z.number().optional(),
  spamCount: z.number().optional(),
  topWords: z.array(z.object({
    word: z.string(),
    count: z.number()
  })),
  topTopics: z.array(z.string()).optional(),
  aiSummary: z.string().optional(),
  isAiAnalyzed: z.boolean().optional(),
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

// Request/Response schemas
export const analyzeVideoSchema = z.object({
  url: z.string().url().refine((url) => {
    return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/') || url.includes('youtube.com/shorts/');
  }, { message: "Must be a valid YouTube URL" }),
});

export const searchCommentsSchema = z.object({
  videoId: z.string(),
  query: z.string().optional(),
  category: z.enum(['all', 'question', 'joke', 'discussion', 'positive', 'negative', 'neutral', 'spam']).default('all'),
  sentiment: z.enum(['all', 'positive', 'negative', 'neutral']).default('all'),
  sortBy: z.enum(['newest', 'oldest', 'likes', 'replies', 'confidence']).default('newest'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type AnalyzeVideoRequest = z.infer<typeof analyzeVideoSchema>;
export type SearchCommentsRequest = z.infer<typeof searchCommentsSchema>;
