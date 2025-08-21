import { Comment, InsertComment } from "@shared/schema";
import { OpenRouterService } from "./openrouter";

interface WordCount {
  word: string;
  count: number;
}

export class CommentAnalyzer {
  private openRouterService: OpenRouterService | null = null;
  
  private questionKeywords = [
    'how', 'what', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 
    'would', 'should', 'will', 'do', 'does', 'did', 'is', 'are', 'was', 'were',
    'explain', 'help', 'anyone know', 'anyone knows'
  ];

  private jokeKeywords = [
    'lol', 'lmao', 'haha', 'rofl', 'funny', 'joke', 'meme', 'epic', 'savage',
    'rekt', 'owned', 'burn', 'cringe', 'based', 'sigma', 'chad', 'sus', 
    'amogus', 'poggers', 'kek', 'xd', 'omg', 'bruh', 'fr', 'no cap'
  ];

  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
    'with', 'by', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her',
    'its', 'our', 'their', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'can', 'may', 'might', 'must', 'shall', 'not', 'no', 'yes', 'all', 'any', 'some',
    'more', 'most', 'other', 'such', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'just', 'now', 'here', 'there', 'when', 'where', 'why', 'how', 'what'
  ]);

  constructor() {
    // Temporarily disable OpenRouter to use enhanced keyword analysis
    // TODO: Fix OpenRouter API integration
    this.openRouterService = null;
    console.log('Using enhanced keyword-based analysis (OpenRouter temporarily disabled)');
  }

  categorizeComment(text: string): 'question' | 'joke' | 'discussion' | 'positive' | 'negative' | 'neutral' | 'spam' {
    const lowerText = text.toLowerCase().trim();
    
    // Check for spam indicators first
    if (this.isSpam(lowerText)) {
      return 'spam';
    }
    
    // Check if it's a question
    if (this.isQuestion(lowerText)) {
      return 'question';
    }
    
    // Check if it's a joke
    if (this.isJoke(lowerText)) {
      return 'joke';
    }
    
    // Check for positive sentiment
    if (this.isPositive(lowerText)) {
      return 'positive';
    }
    
    // Check for negative sentiment
    if (this.isNegative(lowerText)) {
      return 'negative';
    }
    
    // Everything else is a discussion
    return 'discussion';
  }

  private isQuestion(text: string): boolean {
    // Direct question indicators
    if (text.endsWith('?')) {
      return true;
    }
    
    // Check for question keywords at the beginning
    const words = text.split(/\s+/);
    if (words.length > 0) {
      const firstWord = words[0].toLowerCase();
      if (this.questionKeywords.includes(firstWord)) {
        return true;
      }
    }
    
    // Check for question phrases
    const questionPhrases = [
      'can someone', 'does anyone', 'anyone know', 'could you',
      'would you', 'how do', 'what is', 'why is', 'where is',
      'when is', 'who is', 'which is', 'help me', 'please help'
    ];
    
    return questionPhrases.some(phrase => text.includes(phrase));
  }

  private isJoke(text: string): boolean {
    const words = text.split(/\s+/).map(word => word.toLowerCase());
    
    // Check if any joke keywords are present
    return this.jokeKeywords.some(keyword => {
      return words.some(word => word.includes(keyword));
    });
  }

  private isSpam(text: string): boolean {
    const spamIndicators = [
      'subscribe', 'follow me', 'check out my', 'click here', 'free money',
      'win now', 'limited time', 'act now', 'buy now', 'visit my channel',
      'promo', 'discount', 'sale', 'offer', 'deal', 'prize', 'giveaway'
    ];
    
    // Check for repeated characters (often spam)
    if (/(.)\1{4,}/.test(text)) {
      return true;
    }
    
    // Check for spam keywords
    return spamIndicators.some(indicator => text.includes(indicator));
  }

  private isPositive(text: string): boolean {
    const positiveWords = [
      'love', 'great', 'awesome', 'amazing', 'fantastic', 'excellent', 'wonderful', 
      'perfect', 'best', 'incredible', 'brilliant', 'outstanding', 'superb', 'marvelous',
      'good', 'nice', 'cool', 'sweet', 'beautiful', 'helpful', 'useful', 'thanks',
      'thank you', 'appreciate', 'grateful', 'blessed', 'happy', 'joy', 'excited'
    ];
    return positiveWords.some(word => text.includes(word));
  }

  private isNegative(text: string): boolean {
    const negativeWords = [
      'hate', 'awful', 'terrible', 'bad', 'worst', 'horrible', 'disgusting', 
      'pathetic', 'stupid', 'dumb', 'ugly', 'annoying', 'boring', 'useless',
      'waste', 'sucks', 'trash', 'garbage', 'disappointed', 'angry', 'mad',
      'frustrated', 'sad', 'depressed', 'wrong', 'fail', 'failed'
    ];
    return negativeWords.some(word => text.includes(word));
  }

  getSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase().trim();
    
    if (this.isPositive(lowerText)) {
      return 'positive';
    }
    
    if (this.isNegative(lowerText)) {
      return 'negative';
    }
    
    return 'neutral';
  }

  async categorizeCommentsWithAI(comments: Array<{
    id: string;
    authorDisplayName: string;
    authorProfileImageUrl: string | null;
    textDisplay: string;
    textOriginal: string;
    likeCount: number;
    replyCount: number;
    publishedAt: Date;
    updatedAt: Date | null;
    parentId: string | null;
  }>): Promise<InsertComment[]> {
    
    if (!this.openRouterService) {
      // Fallback to basic categorization
      return this.categorizeComments(comments);
    }

    try {
      console.log(`Analyzing ${comments.length} comments with AI...`);
      
      // Prepare comments for AI analysis
      const commentsForAI = comments.map(comment => ({
        id: comment.id,
        text: comment.textDisplay
      }));

      // Get AI analysis
      const aiResults = await this.openRouterService.analyzeCommentsBatch(commentsForAI);

      // Map results back to comments
      const categorizedComments: InsertComment[] = comments.map(comment => {
        const aiResult = aiResults.get(comment.id);
        
        if (aiResult) {
          return {
            ...comment,
            videoId: '', // Will be set by caller
            category: aiResult.category,
            sentiment: aiResult.sentiment,
            topics: aiResult.topics,
            aiConfidence: Math.round(aiResult.confidence * 100),
            aiReasoning: aiResult.reasoning,
            isAiAnalyzed: true,
          };
        } else {
          // Fallback to basic categorization
          return {
            ...comment,
            videoId: '', // Will be set by caller
            category: this.categorizeComment(comment.textDisplay),
            sentiment: null,
            topics: null,
            aiConfidence: null,
            aiReasoning: null,
            isAiAnalyzed: false,
          };
        }
      });

      console.log(`AI analysis completed for ${categorizedComments.filter(c => c.isAiAnalyzed).length}/${comments.length} comments`);
      return categorizedComments;

    } catch (error) {
      console.error('AI analysis failed, falling back to basic categorization:', error);
      return this.categorizeComments(comments);
    }
  }

  extractTopWords(comments: Comment[], limit: number = 20): WordCount[] {
    const wordCounts = new Map<string, number>();
    
    for (const comment of comments) {
      const words = this.extractWords(comment.textDisplay);
      for (const word of words) {
        const normalizedWord = word.toLowerCase();
        if (!this.stopWords.has(normalizedWord) && normalizedWord.length > 2) {
          wordCounts.set(normalizedWord, (wordCounts.get(normalizedWord) || 0) + 1);
        }
      }
    }
    
    // Convert to array and sort by count (using heap-like behavior)
    const wordCountArray: WordCount[] = Array.from(wordCounts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
      
    return wordCountArray;
  }

  private extractWords(text: string): string[] {
    // Remove URLs, mentions, hashtags, and special characters
    const cleanText = text
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/@[\w]+/g, '') // Remove mentions
      .replace(/#[\w]+/g, '') // Remove hashtags
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return cleanText.split(/\s+/).filter(word => word.length > 0);
  }

  categorizeComments(comments: Array<{
    id: string;
    authorDisplayName: string;
    authorProfileImageUrl: string | null;
    textDisplay: string;
    textOriginal: string;
    likeCount: number;
    replyCount: number;
    publishedAt: Date;
    updatedAt: Date | null;
    parentId: string | null;
  }>): InsertComment[] {
    return comments.map(comment => {
      const category = this.categorizeComment(comment.textDisplay);
      const sentiment = this.getSentiment(comment.textDisplay);
      
      return {
        ...comment,
        videoId: '', // Will be set by caller
        category,
        sentiment,
        topics: null, // Enhanced keyword analysis doesn't extract topics
        aiConfidence: 75, // Fixed confidence for keyword-based analysis
        aiReasoning: `Keyword-based analysis: ${category} with ${sentiment} sentiment`,
        isAiAnalyzed: false, // This is keyword-based, not AI
      };
    });
  }

  generateAnalysisStats(comments: Comment[]) {
    const stats = {
      total: comments.length,
      questions: 0,
      jokes: 0,
      discussions: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      spam: 0,
    };

    console.log(`Generating analysis stats for ${comments.length} comments`);

    for (const comment of comments) {
      switch (comment.category) {
        case 'question':
          stats.questions++;
          break;
        case 'joke':
          stats.jokes++;
          break;
        case 'discussion':
          stats.discussions++;
          break;
        case 'positive':
          stats.positive++;
          break;
        case 'negative':
          stats.negative++;
          break;
        case 'neutral':
          stats.neutral++;
          break;
        case 'spam':
          stats.spam++;
          break;
      }
    }

    console.log('Analysis stats:', stats);
    return stats;
  }

  async generateTopicSummary(comments: Comment[]): Promise<{ topics: string[]; summary: string }> {
    if (!this.openRouterService) {
      return {
        topics: ['general discussion'],
        summary: 'AI service not available for detailed analysis'
      };
    }

    try {
      const commentTexts = comments.map(c => c.textDisplay);
      return await this.openRouterService.generateTopicSummary(commentTexts);
    } catch (error) {
      console.error('Topic summary generation failed:', error);
      return {
        topics: ['general discussion'],
        summary: 'Unable to generate AI summary'
      };
    }
  }
}
