import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { YouTubeService } from "./services/youtube";
import { CommentAnalyzer } from "./services/analyzer";
import { Trie } from "./services/trie";
import { analyzeVideoSchema, searchCommentsSchema } from "@shared/schema";

// Global trie instances for fast search (indexed by videoId)
const videoTries = new Map<string, Trie>();

export async function registerRoutes(app: Express): Promise<Server> {
  const youtubeService = new YouTubeService();
  const analyzer = new CommentAnalyzer();

  // Analyze video endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = analyzeVideoSchema.parse(req.body);
      
      // Check if we already have this video
      const existingVideo = await storage.getVideoByUrl(url);
      if (existingVideo) {
        const analysis = await storage.getAnalysisByVideoId(existingVideo.id);
        if (analysis) {
          return res.json({
            video: existingVideo,
            analysis,
            message: "Analysis already exists for this video"
          });
        }
      }

      // Fetch video data from YouTube
      const { video: videoData, comments: rawComments } = await youtubeService.fetchVideoData(url);
      
      // Create or update video
      let video = existingVideo;
      if (!video) {
        video = await storage.createVideo(videoData);
      }

      // Categorize comments
      const categorizedComments = analyzer.categorizeComments(rawComments);
      const commentsWithVideoId = categorizedComments.map(comment => ({
        ...comment,
        videoId: video!.id,
      }));

      // Store comments
      const savedComments = await storage.createComments(commentsWithVideoId);

      // Generate analysis
      const stats = analyzer.generateAnalysisStats(savedComments);
      const topWords = analyzer.extractTopWords(savedComments, 20);

      const analysis = await storage.createAnalysis({
        videoId: video.id,
        totalComments: stats.total,
        questionsCount: stats.questions,
        jokesCount: stats.jokes,
        discussionsCount: stats.discussions,
        topWords,
      });

      // Build Trie for fast search
      const trie = Trie.fromComments(savedComments.map(comment => ({
        id: comment.id,
        textDisplay: comment.textDisplay,
        authorDisplayName: comment.authorDisplayName,
      })));
      videoTries.set(video.id, trie);

      res.json({
        video,
        analysis,
        message: "Analysis completed successfully"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Analysis failed" 
      });
    }
  });

  // Get video analysis
  app.get("/api/video/:videoId/analysis", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      const analysis = await storage.getAnalysisByVideoId(videoId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json({
        video,
        analysis
      });
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  // Search comments
  app.post("/api/search", async (req, res) => {
    try {
      const { videoId, query, category, sortBy, page, limit } = searchCommentsSchema.parse(req.body);
      
      let comments = await storage.getCommentsByVideoId(videoId);
      
      // Apply Trie-based search if query provided
      if (query && query.trim()) {
        const trie = videoTries.get(videoId);
        if (trie) {
          const matchingCommentIds = trie.startsWith(query.trim());
          comments = comments.filter(comment => matchingCommentIds.has(comment.id));
        } else {
          // Fallback to simple text search
          const searchTerm = query.toLowerCase().trim();
          comments = comments.filter(comment => 
            comment.textDisplay.toLowerCase().includes(searchTerm) ||
            comment.authorDisplayName.toLowerCase().includes(searchTerm)
          );
        }
      }

      // Filter by category
      if (category && category !== 'all') {
        comments = comments.filter(comment => comment.category === category);
      }

      // Sort comments
      switch (sortBy) {
        case 'newest':
          comments.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
          break;
        case 'oldest':
          comments.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
          break;
        case 'likes':
          comments.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          break;
        case 'replies':
          comments.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
          break;
      }

      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedComments = comments.slice(startIndex, endIndex);

      res.json({
        comments: paginatedComments,
        pagination: {
          page,
          limit,
          total: comments.length,
          totalPages: Math.ceil(comments.length / limit),
          hasNext: endIndex < comments.length,
          hasPrev: page > 1,
        }
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Search failed" 
      });
    }
  });

  // Get questions only (for questions table)
  app.get("/api/video/:videoId/questions", async (req, res) => {
    try {
      const { videoId } = req.params;
      const { page = '1', limit = '10', sortBy = 'newest' } = req.query;
      
      let comments = await storage.searchComments(videoId, undefined, 'question');
      
      // Sort comments
      switch (sortBy) {
        case 'newest':
          comments.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
          break;
        case 'oldest':
          comments.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
          break;
        case 'likes':
          comments.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          break;
        case 'replies':
          comments.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
          break;
      }

      // Paginate
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedComments = comments.slice(startIndex, endIndex);

      res.json({
        comments: paginatedComments,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: comments.length,
          totalPages: Math.ceil(comments.length / limitNum),
          hasNext: endIndex < comments.length,
          hasPrev: pageNum > 1,
        }
      });
    } catch (error) {
      console.error("Get questions error:", error);
      res.status(500).json({ message: "Failed to retrieve questions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
