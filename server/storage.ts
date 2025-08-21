import { type Video, type InsertVideo, type Comment, type InsertComment, type Analysis, type InsertAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Video operations
  getVideo(id: string): Promise<Video | undefined>;
  getVideoByUrl(url: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Comment operations
  getComment(id: string): Promise<Comment | undefined>;
  getCommentsByVideoId(videoId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  createComments(comments: InsertComment[]): Promise<Comment[]>;
  searchComments(videoId: string, query?: string, category?: string): Promise<Comment[]>;
  
  // Analysis operations
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getAnalysisByVideoId(videoId: string): Promise<Analysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
}

export class MemStorage implements IStorage {
  private videos: Map<string, Video>;
  private comments: Map<string, Comment>;
  private analyses: Map<string, Analysis>;
  private videosByUrl: Map<string, Video>;
  private commentsByVideoId: Map<string, Comment[]>;

  constructor() {
    this.videos = new Map();
    this.comments = new Map();
    this.analyses = new Map();
    this.videosByUrl = new Map();
    this.commentsByVideoId = new Map();
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideoByUrl(url: string): Promise<Video | undefined> {
    return this.videosByUrl.get(url);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo, 
      id, 
      duration: insertVideo.duration || null,
      description: insertVideo.description || null,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      viewCount: insertVideo.viewCount || null,
      likeCount: insertVideo.likeCount || null,
      commentCount: insertVideo.commentCount || null,
      publishedAt: insertVideo.publishedAt || null,
      createdAt: new Date()
    };
    this.videos.set(id, video);
    this.videosByUrl.set(insertVideo.url, video);
    return video;
  }

  async getComment(id: string): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsByVideoId(videoId: string): Promise<Comment[]> {
    return this.commentsByVideoId.get(videoId) || [];
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = { 
      ...insertComment, 
      id,
      likeCount: insertComment.likeCount || null,
      replyCount: insertComment.replyCount || null,
      authorProfileImageUrl: insertComment.authorProfileImageUrl || null,
      updatedAt: insertComment.updatedAt || null,
      parentId: insertComment.parentId || null,
      sentiment: insertComment.sentiment || null,
      topics: (insertComment.topics as string[]) || null,
      aiConfidence: insertComment.aiConfidence || null,
      aiReasoning: insertComment.aiReasoning || null,
      isAiAnalyzed: insertComment.isAiAnalyzed || false
    };
    this.comments.set(id, comment);
    
    // Update videoId index
    const videoComments = this.commentsByVideoId.get(insertComment.videoId) || [];
    videoComments.push(comment);
    this.commentsByVideoId.set(insertComment.videoId, videoComments);
    
    return comment;
  }

  async createComments(insertComments: InsertComment[]): Promise<Comment[]> {
    const comments: Comment[] = [];
    for (const insertComment of insertComments) {
      const comment = await this.createComment(insertComment);
      comments.push(comment);
    }
    return comments;
  }

  async searchComments(videoId: string, query?: string, category?: string): Promise<Comment[]> {
    let comments = this.commentsByVideoId.get(videoId) || [];
    
    // Filter by category
    if (category && category !== 'all') {
      comments = comments.filter(comment => comment.category === category);
    }
    
    // Filter by query (simple text search)
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      comments = comments.filter(comment => 
        comment.textDisplay.toLowerCase().includes(searchTerm) ||
        comment.authorDisplayName.toLowerCase().includes(searchTerm)
      );
    }
    
    return comments;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysisByVideoId(videoId: string): Promise<Analysis | undefined> {
    return Array.from(this.analyses.values()).find(analysis => analysis.videoId === videoId);
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = { 
      ...insertAnalysis, 
      id, 
      positiveCount: insertAnalysis.positiveCount || 0,
      negativeCount: insertAnalysis.negativeCount || 0,
      neutralCount: insertAnalysis.neutralCount || 0,
      spamCount: insertAnalysis.spamCount || 0,
      topTopics: (insertAnalysis.topTopics as string[]) || null,
      aiSummary: insertAnalysis.aiSummary || null,
      isAiAnalyzed: insertAnalysis.isAiAnalyzed || false,
      topWords: insertAnalysis.topWords as Array<{word: string, count: number}>,
      createdAt: new Date()
    };
    this.analyses.set(id, analysis);
    return analysis;
  }
}

export const storage = new MemStorage();
