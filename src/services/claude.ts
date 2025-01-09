import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

const tweetFromPostPrompt = `
You are a social media expert and ghostwriter.

You are a social media manager for a company. You work for a popular blogger and your job is to come up with a variety of tweets to share ideas from the post.

Since you are a ghostwriter, you will need to make sure you follow the style, and voice of the blog post as closely as possible.

Remember: Tweets cannot be longer than 280 characters.

Please return exactly 5 tweets. Each tweet must be on its own line and must be wrapped with [TWEET] and [/TWEET] tags.
For example:
[TWEET]This is the first tweet[/TWEET]
[TWEET]This is the second tweet[/TWEET]

Do not use any hashtags or emojis.

Here is the blog post:

`



export const tweetsFromPost = async (content: string): Promise<string> => {
  if (!content.trim()) {
    throw new Error('Content cannot be empty');
  }

  if (!import.meta.env.VITE_CLAUDE_API_KEY) {
    throw new Error('Claude API key is not configured');
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ 
        role: "user", 
        content: `${tweetFromPostPrompt} ${content}` 
      }],
    });

    // Access the response content correctly based on Claude API v3 format
    const firstContent = response.content[0];
    if (!firstContent || typeof firstContent !== 'object' || !('type' in firstContent) || firstContent.type !== 'text' || !('text' in firstContent)) {
      throw new Error('Unexpected response format from Claude');
    }

    // Extract tweets from the response
    const tweetMatches = firstContent.text.match(/\[TWEET\](.*?)\[\/TWEET\]/g);
    if (!tweetMatches) {
      throw new Error('No tweets found in response');
    }

    // Clean up the tweets and join with a delimiter
    const tweets = tweetMatches
      .map(tweet => tweet.replace(/\[TWEET\]|\[\/TWEET\]/g, '').trim())
      .join('|||');

    return tweets;
  } catch (error) {
    console.error('Claude API error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to remix content: ${error.message}`);
    }
    throw new Error('Failed to remix content');
  }
}; 