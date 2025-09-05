interface YouTubeComment {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: { value: string };
    videoId: string;
    textDisplay: string;
    textOriginal: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
    parentId?: string;
    totalReplyCount?: number;
  };
}

interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    defaultAudioLanguage?: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!this.apiKey) {
      console.error('YouTube API key is required. Set YOUTUBE_API_KEY or GOOGLE_API_KEY environment variable.');
      console.error('Current environment variables:', Object.keys(process.env).filter(k => k.includes('API')));
    }
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  async getVideoDetails(videoId: string) {
    const url = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video: YouTubeVideo = data.items[0];
    
    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
      viewCount: parseInt(video.statistics.viewCount) || 0,
      likeCount: parseInt(video.statistics.likeCount) || 0,
      commentCount: parseInt(video.statistics.commentCount) || 0,
      duration: video.contentDetails.duration,
      publishedAt: new Date(video.snippet.publishedAt),
    };
  }

  async getVideoComments(videoId: string): Promise<YouTubeComment[]> {
    const comments: YouTubeComment[] = [];
    let nextPageToken: string | undefined;
    let pageCount = 0;

    console.log(`🔍 Starting to fetch comments for video: ${videoId}`);

    do {
      pageCount++;
      const url = `${this.baseUrl}/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=100&order=time&key=${this.apiKey}${
        nextPageToken ? `&pageToken=${nextPageToken}` : ''
      }`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 403) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error('Comments are disabled for this video or API quota exceeded');
          }
          throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
          console.log(`📄 Page ${pageCount}: No more comments found`);
          break;
        }

        let pageComments = 0;
        
        for (const item of data.items) {
          // Add the main comment
          comments.push({
            ...item.snippet.topLevelComment,
            snippet: {
              ...item.snippet.topLevelComment.snippet,
              totalReplyCount: item.snippet.totalReplyCount || 0,
            },
          });
          pageComments++;

          // Add replies if they exist
          if (item.replies && item.replies.comments) {
            for (const reply of item.replies.comments) {
              comments.push({
                ...reply,
                snippet: {
                  ...reply.snippet,
                  parentId: item.snippet.topLevelComment.id,
                },
              });
              pageComments++;
            }
          }
        }

        console.log(`📄 Page ${pageCount}: Fetched ${pageComments} comments (Total: ${comments.length})`);
        nextPageToken = data.nextPageToken;
        
        // Add small delay to avoid rate limiting
        if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.error(`❌ Error fetching page ${pageCount}:`, error);
        // If it's an API error, break the loop
        if (error instanceof Error && error.message.includes('API')) {
          break;
        }
        // For other errors, continue with next page if we have a token
        if (!nextPageToken) break;
      }
      
      // Log progress for debugging
      if (pageCount % 5 === 0) {
        console.log(`📈 Progress: ${comments.length} comments fetched after ${pageCount} pages`);
      }
      
      // Remove artificial limit - fetch all comments
      // Only break if we hit API limits or no more comments
    } while (nextPageToken);

    console.log(`✅ Comment fetching completed: ${comments.length} total comments from ${pageCount} pages`);
    return comments;
  }

  async fetchVideoData(url: string) {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const [videoDetails, comments] = await Promise.all([
      this.getVideoDetails(videoId),
      this.getVideoComments(videoId),
    ]);

    // Log comment fetching statistics
    const reportedCommentCount = videoDetails.commentCount;
    const fetchedCommentCount = comments.length;
    
    console.log(`\n📊 Comment Fetching Statistics:`);
    console.log(`📺 Video: ${videoDetails.title}`);
    console.log(`📈 Comments reported by YouTube API: ${reportedCommentCount}`);
    console.log(`💾 Comments actually fetched: ${fetchedCommentCount}`);
    
    if (fetchedCommentCount < reportedCommentCount) {
      const missingCount = reportedCommentCount - fetchedCommentCount;
      console.log(`⚠️  Missing comments: ${missingCount} (${((missingCount / reportedCommentCount) * 100).toFixed(1)}%)`);
      console.log(`📋 Possible reasons: Private comments, deleted comments, API pagination limits, or comments disabled on replies`);
    } else {
      console.log(`✅ All available comments fetched successfully!`);
    }

    return {
      video: { ...videoDetails, id: videoId, url },
      comments: comments.map(comment => ({
        id: comment.id,
        authorDisplayName: comment.snippet.authorDisplayName,
        authorProfileImageUrl: comment.snippet.authorProfileImageUrl,
        textDisplay: comment.snippet.textDisplay,
        textOriginal: comment.snippet.textOriginal,
        likeCount: comment.snippet.likeCount,
        replyCount: comment.snippet.totalReplyCount || 0,
        publishedAt: new Date(comment.snippet.publishedAt),
        updatedAt: comment.snippet.updatedAt ? new Date(comment.snippet.updatedAt) : null,
        parentId: comment.snippet.parentId || null,
      })),
      fetchingStats: {
        reportedCount: reportedCommentCount,
        fetchedCount: fetchedCommentCount,
        missingCount: Math.max(0, reportedCommentCount - fetchedCommentCount),
        fetchSuccess: fetchedCommentCount >= reportedCommentCount
      }
    };
  }
}
