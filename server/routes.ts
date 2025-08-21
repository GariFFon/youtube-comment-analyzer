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

  console.log('Routes registered successfully');

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

      // Categorize comments with AI
      const categorizedComments = await analyzer.categorizeCommentsWithAI(rawComments);
      const commentsWithVideoId = categorizedComments.map(comment => ({
        ...comment,
        videoId: video!.id,
      }));

      // Store comments
      const savedComments = await storage.createComments(commentsWithVideoId);

      // Generate analysis
      const stats = analyzer.generateAnalysisStats(savedComments);
      const topWords = analyzer.extractTopWords(savedComments, 20);
      const topicSummary = await analyzer.generateTopicSummary(savedComments);

      const analysis = await storage.createAnalysis({
        videoId: video.id,
        totalComments: stats.total,
        questionsCount: stats.questions,
        jokesCount: stats.jokes,
        discussionsCount: stats.discussions,
        positiveCount: stats.positive,
        negativeCount: stats.negative,
        neutralCount: stats.neutral,
        spamCount: stats.spam,
        topWords,
        topTopics: topicSummary.topics,
        aiSummary: topicSummary.summary,
        isAiAnalyzed: savedComments.some(c => c.isAiAnalyzed),
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
      
      console.log('Analysis response sent:', {
        videoId: video.id,
        videoTitle: video.title,
        analysisId: analysis.id,
        totalComments: analysis.totalComments,
        questionsCount: analysis.questionsCount,
        jokesCount: analysis.jokesCount,
        discussionsCount: analysis.discussionsCount
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
      const { videoId, query, category, sentiment, sortBy, page, limit } = searchCommentsSchema.parse(req.body);
      
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

      // Filter by sentiment
      if (sentiment && sentiment !== 'all') {
        comments = comments.filter(comment => comment.sentiment === sentiment);
      }

      // Sort comments
      switch (sortBy) {
        case 'newest':
          comments.sort((a, b) => {
            const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
            const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'oldest':
          comments.sort((a, b) => {
            const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
            const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
            return dateA.getTime() - dateB.getTime();
          });
          break;
        case 'likes':
          comments.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          break;
        case 'replies':
          comments.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
          break;
        case 'confidence':
          comments.sort((a, b) => (b.aiConfidence || 0) - (a.aiConfidence || 0));
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
          comments.sort((a, b) => {
            const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
            const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'oldest':
          comments.sort((a, b) => {
            const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
            const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
            return dateA.getTime() - dateB.getTime();
          });
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

  // Re-analyze existing video with AI
  app.post("/api/video/:videoId/reanalyze", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      const existingComments = await storage.getCommentsByVideoId(videoId);
      if (existingComments.length === 0) {
        return res.status(400).json({ message: "No comments found for this video" });
      }

      console.log(`Re-analyzing ${existingComments.length} comments with AI...`);

      // Transform existing comments to the format needed for AI analysis
      const commentsForReanalysis = existingComments.map(comment => ({
        id: comment.id,
        authorDisplayName: comment.authorDisplayName,
        authorProfileImageUrl: comment.authorProfileImageUrl,
        textDisplay: comment.textDisplay,
        textOriginal: comment.textOriginal,
        likeCount: comment.likeCount || 0,
        replyCount: comment.replyCount || 0,
        publishedAt: comment.publishedAt,
        updatedAt: comment.updatedAt,
        parentId: comment.parentId,
      }));

      // Analyze with AI
      const reanalyzedComments = await analyzer.categorizeCommentsWithAI(commentsForReanalysis);
      const commentsWithVideoId = reanalyzedComments.map(comment => ({
        ...comment,
        videoId,
      }));

      // Store updated comments (this will overwrite existing ones in memory storage)
      const savedComments = await storage.createComments(commentsWithVideoId);

      // Generate updated analysis
      const stats = analyzer.generateAnalysisStats(savedComments);
      const topWords = analyzer.extractTopWords(savedComments, 20);
      const topicSummary = await analyzer.generateTopicSummary(savedComments);

      const analysis = await storage.createAnalysis({
        videoId: video.id,
        totalComments: stats.total,
        questionsCount: stats.questions,
        jokesCount: stats.jokes,
        discussionsCount: stats.discussions,
        positiveCount: stats.positive,
        negativeCount: stats.negative,
        neutralCount: stats.neutral,
        spamCount: stats.spam,
        topWords,
        topTopics: topicSummary.topics,
        aiSummary: topicSummary.summary,
        isAiAnalyzed: savedComments.some(c => c.isAiAnalyzed),
      });

      res.json({
        video,
        analysis,
        aiAnalyzedCount: savedComments.filter(c => c.isAiAnalyzed).length,
        totalComments: savedComments.length,
        message: "Re-analysis completed successfully"
      });
    } catch (error) {
      console.error("Re-analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Re-analysis failed" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
