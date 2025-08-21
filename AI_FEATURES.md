# AI-Powered Comment Analysis Features

## Overview
This YouTube Comment Analyzer now includes AI-powered analysis using OpenRouter API to provide more sophisticated comment classification and sentiment analysis.

## Features

### Enhanced Comment Classification
- **Question**: Comments asking for information, help, or clarification
- **Joke**: Humorous content, memes, sarcasm
- **Discussion**: Thoughtful commentary or analysis
- **Positive**: Praise, appreciation, positive feedback
- **Negative**: Criticism, complaints, negative feedback
- **Neutral**: Factual statements, neutral observations
- **Spam**: Promotional content, irrelevant messages, or repetitive content

### Sentiment Analysis
- **Positive**: Comments expressing positive emotions
- **Negative**: Comments expressing negative emotions
- **Neutral**: Comments with neutral tone

### AI-Enhanced Features
- **Topic Extraction**: AI identifies main topics discussed in comments
- **Confidence Scoring**: Each AI analysis includes a confidence score (0-100)
- **Reasoning**: AI provides reasoning for its classification decisions
- **Batch Processing**: Efficient analysis of multiple comments with rate limiting

## API Endpoints

### Analyze Video (Enhanced)
```
POST /api/analyze
```
Now includes AI analysis for all comments when OpenRouter API key is available.

### Re-analyze Existing Video
```
POST /api/video/:videoId/reanalyze
```
Re-analyze existing comments with AI to get enhanced categorization and sentiment analysis.

### Search Comments (Enhanced)
```
POST /api/search
```
Enhanced search with new parameters:
- `sentiment`: Filter by 'positive', 'negative', 'neutral', or 'all'
- `sortBy`: New option 'confidence' to sort by AI confidence score

## Configuration

### Environment Variables
Add to your `.env` file:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Fallback Behavior
- If OpenRouter API is not available, the system falls back to keyword-based classification
- Analysis still works but with reduced accuracy and no sentiment analysis

## Usage Example

1. **Basic Analysis**: Just provide a YouTube URL - AI analysis happens automatically
2. **Re-analysis**: For existing videos, use the re-analyze endpoint to upgrade to AI analysis
3. **Filtering**: Use the enhanced search to filter by sentiment and AI confidence

## API Response Updates

### Comment Objects
Now include additional fields:
```json
{
  "id": "comment_id",
  "category": "positive",
  "sentiment": "positive",
  "topics": ["tutorial", "helpful"],
  "aiConfidence": 85,
  "aiReasoning": "Comment expresses gratitude and positive feedback",
  "isAiAnalyzed": true
}
```

### Analysis Objects
Enhanced with AI insights:
```json
{
  "totalComments": 150,
  "positiveCount": 45,
  "negativeCount": 12,
  "neutralCount": 38,
  "spamCount": 5,
  "topTopics": ["tutorial", "helpful", "beginner"],
  "aiSummary": "Generally positive response to tutorial content",
  "isAiAnalyzed": true
}
```

## Rate Limiting
- AI analysis processes comments in batches of 5
- 1-second delay between batches to respect API limits
- Automatic fallback on API errors

## Model Used
- **OpenRouter Model**: meta-llama/llama-3.1-8b-instruct:free
- **Cost**: Free tier model for cost-effective analysis
- **Temperature**: 0.3 for consistent results
- **Max Tokens**: 300 for detailed analysis
