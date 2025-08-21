interface OpenRouterResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface CommentAnalysisResult {
  category: 'question' | 'joke' | 'discussion' | 'positive' | 'negative' | 'neutral' | 'spam';
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  confidence: number;
  reasoning: string;
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private model = 'gpt-3.5-turbo'; // More reliable model

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable.');
    }
  }

  async analyzeComment(text: string): Promise<CommentAnalysisResult> {
    const prompt = `
Analyze this YouTube comment and provide a JSON response with the following structure:
{
  "category": "question|joke|discussion|positive|negative|neutral|spam",
  "sentiment": "positive|negative|neutral",
  "topics": ["topic1", "topic2"],
  "confidence": 0.85,
  "reasoning": "Brief explanation of the classification"
}

Categories:
- question: Asking for information, help, or clarification
- joke: Humorous content, memes, sarcasm
- discussion: Thoughtful commentary or analysis
- positive: Praise, appreciation, positive feedback
- negative: Criticism, complaints, negative feedback
- neutral: Factual statements, neutral observations
- spam: Promotional content, irrelevant messages, or repetitive content

Comment to analyze: "${text.replace(/"/g, '\\"')}"

Respond only with valid JSON:`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://youtube-comment-analyzer.com',
          'X-Title': 'YouTube Comment Analyzer'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error Response:', response.status, response.statusText, errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenRouter API');
      }

      // Try to parse the JSON response
      try {
        const result = JSON.parse(content);
        
        // Validate the response structure
        if (!result.category || !result.sentiment) {
          throw new Error('Invalid response structure from AI');
        }

        return {
          category: result.category,
          sentiment: result.sentiment,
          topics: result.topics || [],
          confidence: result.confidence || 0.5,
          reasoning: result.reasoning || 'AI analysis completed'
        };
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        // Fallback to basic analysis
        return this.getFallbackAnalysis(text);
      }
    } catch (error) {
      console.error('OpenRouter API error:', error);
      // Fallback to basic analysis
      return this.getFallbackAnalysis(text);
    }
  }

  async analyzeCommentsBatch(comments: Array<{ id: string; text: string }>): Promise<Map<string, CommentAnalysisResult>> {
    const results = new Map<string, CommentAnalysisResult>();
    
    console.log(`Starting AI analysis for ${comments.length} comments...`);
    
    // Process only a small sample first to test API
    const sampleSize = Math.min(comments.length, 3);
    const sampleComments = comments.slice(0, sampleSize);
    
    // Test with a single comment first
    try {
      console.log('Testing OpenRouter API with first comment...');
      const testResult = await this.analyzeComment(sampleComments[0].text);
      console.log('API test successful:', testResult);
      results.set(sampleComments[0].id, testResult);
    } catch (error) {
      console.warn('OpenRouter API test failed, using fallback for all comments:', error);
      // Use fallback for all comments
      for (const comment of comments) {
        results.set(comment.id, this.getFallbackAnalysis(comment.text));
      }
      return results;
    }
    
    // If first comment succeeded, continue with the rest
    for (let i = 1; i < comments.length; i++) {
      try {
        const analysis = await this.analyzeComment(comments[i].text);
        results.set(comments[i].id, analysis);
        
        // Add delay between requests
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Failed to analyze comment ${comments[i].id}:`, error);
        results.set(comments[i].id, this.getFallbackAnalysis(comments[i].text));
      }
    }

    console.log(`AI analysis completed: ${Array.from(results.values()).filter(r => r.confidence > 0.5).length}/${comments.length} successful`);
    return results;
  }

  private getFallbackAnalysis(text: string): CommentAnalysisResult {
    const lowerText = text.toLowerCase();
    
    // Simple fallback categorization
    let category: CommentAnalysisResult['category'] = 'neutral';
    let sentiment: CommentAnalysisResult['sentiment'] = 'neutral';
    
    // Question detection
    if (lowerText.includes('?') || lowerText.includes('how') || lowerText.includes('what') || lowerText.includes('why')) {
      category = 'question';
    }
    // Joke detection
    else if (lowerText.includes('lol') || lowerText.includes('haha') || lowerText.includes('funny')) {
      category = 'joke';
      sentiment = 'positive';
    }
    // Positive sentiment
    else if (lowerText.includes('love') || lowerText.includes('great') || lowerText.includes('awesome') || lowerText.includes('amazing')) {
      category = 'positive';
      sentiment = 'positive';
    }
    // Negative sentiment
    else if (lowerText.includes('hate') || lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('awful')) {
      category = 'negative';
      sentiment = 'negative';
    }
    // Discussion
    else if (text.length > 100) {
      category = 'discussion';
    }

    return {
      category,
      sentiment,
      topics: [],
      confidence: 0.3,
      reasoning: 'Fallback analysis due to AI service unavailability'
    };
  }

  async generateTopicSummary(comments: string[]): Promise<{ topics: string[]; summary: string }> {
    if (comments.length === 0) {
      return { topics: [], summary: 'No comments to analyze' };
    }

    // Take a sample of comments to avoid token limits
    const sampleComments = comments.slice(0, 20).join('\n---\n');
    
    const prompt = `
Analyze these YouTube comments and provide a JSON response with:
{
  "topics": ["topic1", "topic2", "topic3"],
  "summary": "Brief summary of the main discussion themes"
}

Comments:
${sampleComments}

Respond only with valid JSON:`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://youtube-comment-analyzer.com',
          'X-Title': 'YouTube Comment Analyzer'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenRouter API');
      }

      const result = JSON.parse(content);
      return {
        topics: result.topics || [],
        summary: result.summary || 'Analysis completed'
      };
    } catch (error) {
      console.error('Topic summary error:', error);
      return {
        topics: ['general discussion'],
        summary: 'Unable to generate detailed summary'
      };
    }
  }
}
