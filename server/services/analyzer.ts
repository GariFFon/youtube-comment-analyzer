import { Comment, InsertComment } from "@shared/schema";

interface WordCount {
  word: string;
  count: number;
}

export class CommentAnalyzer {
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

  categorizeComment(text: string): 'question' | 'joke' | 'discussion' {
    const lowerText = text.toLowerCase().trim();
    
    // Check if it's a question
    if (this.isQuestion(lowerText)) {
      return 'question';
    }
    
    // Check if it's a joke
    if (this.isJoke(lowerText)) {
      return 'joke';
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
    return comments.map(comment => ({
      ...comment,
      videoId: '', // Will be set by caller
      category: this.categorizeComment(comment.textDisplay),
    }));
  }

  generateAnalysisStats(comments: Comment[]) {
    const stats = {
      total: comments.length,
      questions: 0,
      jokes: 0,
      discussions: 0,
    };

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
      }
    }

    return stats;
  }
}
