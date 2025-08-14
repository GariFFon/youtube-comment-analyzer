import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey(),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  channelTitle: text("channel_title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  viewCount: integer("view_count"),
  likeCount: integer("like_count"),
  commentCount: integer("comment_count"),
  duration: text("duration"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey(),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  authorDisplayName: text("author_display_name").notNull(),
  authorProfileImageUrl: text("author_profile_image_url"),
  textDisplay: text("text_display").notNull(),
  textOriginal: text("text_original").notNull(),
  likeCount: integer("like_count").default(0),
  replyCount: integer("reply_count").default(0),
  publishedAt: timestamp("published_at").notNull(),
  updatedAt: timestamp("updated_at"),
  parentId: varchar("parent_id"),
  category: text("category").notNull(), // 'question', 'joke', 'discussion'
});

export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  totalComments: integer("total_comments").notNull(),
  questionsCount: integer("questions_count").notNull(),
  jokesCount: integer("jokes_count").notNull(),
  discussionsCount: integer("discussions_count").notNull(),
  topWords: jsonb("top_words").$type<Array<{word: string, count: number}>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// Request/Response schemas
export const analyzeVideoSchema = z.object({
  url: z.string().url().refine((url) => {
    return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/') || url.includes('youtube.com/shorts/');
  }, { message: "Must be a valid YouTube URL" }),
});

export const searchCommentsSchema = z.object({
  videoId: z.string(),
  query: z.string().optional(),
  category: z.enum(['all', 'question', 'joke', 'discussion']).default('all'),
  sortBy: z.enum(['newest', 'oldest', 'likes', 'replies']).default('newest'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type AnalyzeVideoRequest = z.infer<typeof analyzeVideoSchema>;
export type SearchCommentsRequest = z.infer<typeof searchCommentsSchema>;
