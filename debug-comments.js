#!/usr/bin/env node
/**
 * Debug script to check comment fetching statistics
 * Usage: node debug-comments.js [VIDEO_URL]
 */

const API_BASE = 'http://localhost:8000/api';

async function debugComments(videoUrl) {
  try {
    console.log('🔍 Debugging comment fetching for:', videoUrl);
    console.log('=====================================\n');

    // First analyze the video
    console.log('📊 Analyzing video...');
    const analyzeResponse = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoUrl })
    });

    if (!analyzeResponse.ok) {
      throw new Error(`Analysis failed: ${analyzeResponse.statusText}`);
    }

    const analyzeData = await analyzeResponse.json();
    const { video, analysis, fetchingStats } = analyzeData;

    console.log('✅ Analysis completed!\n');

    // Display comprehensive statistics
    console.log('📺 VIDEO INFORMATION:');
    console.log(`   Title: ${video.title}`);
    console.log(`   Channel: ${video.channelTitle}`);
    console.log(`   Published: ${new Date(video.publishedAt).toLocaleDateString()}`);
    console.log(`   Views: ${video.viewCount.toLocaleString()}`);
    console.log(`   Likes: ${video.likeCount.toLocaleString()}\n`);

    console.log('💬 COMMENT STATISTICS:');
    console.log(`   📈 YouTube Reports: ${video.commentCount.toLocaleString()} total comments`);
    console.log(`   💾 Actually Fetched: ${analysis.totalComments.toLocaleString()} comments`);
    
    const missingCount = video.commentCount - analysis.totalComments;
    if (missingCount > 0) {
      console.log(`   ❌ Missing Comments: ${missingCount.toLocaleString()} (${((missingCount / video.commentCount) * 100).toFixed(1)}%)`);
      console.log(`   📊 Success Rate: ${((analysis.totalComments / video.commentCount) * 100).toFixed(1)}%\n`);
      
      console.log('⚠️  POSSIBLE REASONS FOR MISSING COMMENTS:');
      console.log('   • Private or deleted comments');
      console.log('   • Comments disabled on some reply threads');
      console.log('   • YouTube API pagination limits');
      console.log('   • Rate limiting or API quota restrictions');
      console.log('   • Regional restrictions or age-gated content\n');
    } else {
      console.log(`   ✅ Success Rate: 100% - All comments fetched!\n`);
    }

    console.log('🏷️  COMMENT CATEGORIES:');
    console.log(`   ❓ Questions: ${analysis.questionsCount.toLocaleString()}`);
    console.log(`   😂 Jokes: ${analysis.jokesCount.toLocaleString()}`);
    console.log(`   💬 Discussions: ${analysis.discussionsCount.toLocaleString()}`);
    console.log(`   👍 Positive: ${analysis.positiveCount.toLocaleString()}`);
    console.log(`   👎 Negative: ${analysis.negativeCount.toLocaleString()}`);
    console.log(`   😐 Neutral: ${analysis.neutralCount.toLocaleString()}`);
    console.log(`   🚫 Spam: ${analysis.spamCount.toLocaleString()}\n`);

    if (fetchingStats) {
      console.log('🔧 FETCHING DETAILS:');
      console.log(`   Reported by API: ${fetchingStats.reportedCount.toLocaleString()}`);
      console.log(`   Successfully fetched: ${fetchingStats.fetchedCount.toLocaleString()}`);
      console.log(`   Missing: ${fetchingStats.missingCount.toLocaleString()}`);
      console.log(`   Fetch success: ${fetchingStats.fetchSuccess ? '✅' : '❌'}\n`);
    }

    // Try to get detailed comment stats
    try {
      const statsResponse = await fetch(`${API_BASE}/video/${video.id}/comment-stats`);
      if (statsResponse.ok) {
        const detailedStats = await statsResponse.json();
        console.log('📊 DETAILED ANALYSIS:');
        console.log(`   Video: ${detailedStats.videoTitle}`);
        console.log(`   Reported comments: ${detailedStats.reportedCommentCount.toLocaleString()}`);
        console.log(`   Fetched comments: ${detailedStats.fetchedCommentCount.toLocaleString()}`);
        console.log(`   Analyzed comments: ${detailedStats.analyzedCommentCount.toLocaleString()}`);
        console.log(`   Missing comments: ${detailedStats.missingCommentCount.toLocaleString()}`);
        console.log(`   Success rate: ${detailedStats.fetchSuccessRate}%`);
        console.log(`   All comments fetched: ${detailedStats.isAllCommentsFetched ? '✅' : '❌'}\n`);
      }
    } catch (error) {
      console.log('⚠️ Could not fetch detailed stats:', error.message);
    }

    console.log('=====================================');
    console.log('🎯 RECOMMENDATION:');
    if (missingCount > 0) {
      console.log(`   ${missingCount} comments couldn't be fetched.`);
      console.log('   This is normal for many YouTube videos due to:');
      console.log('   - Private/deleted comments, API limitations, etc.');
      console.log('   - The analysis is still valid for the fetched comments.');
    } else {
      console.log('   Perfect! All available comments were fetched and analyzed.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get video URL from command line or use default
const videoUrl = process.argv[2] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

if (require.main === module) {
  debugComments(videoUrl);
}

module.exports = { debugComments };
