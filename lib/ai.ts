/**
 * AI Client for Redd Radar
 * Generates helpful Reddit reply drafts using OpenAI or Anthropic
 */

export interface ReplyContext {
  postTitle: string;
  postBody: string;
  subreddit: string;
  productName: string;
  productDescription: string;
  productWebsite: string;
  targetAudience: string;
  productFeatures?: string[];
  replyStyle?: 'helpful' | 'casual' | 'technical' | 'empathetic';
}

export interface GeneratedReply {
  reply: string;
  tone: string;
  tips: string[];
  aiConfigured: boolean;
}

/**
 * Build the system prompt with strict guidelines to prevent hallucination
 */
function buildSystemPrompt(context: ReplyContext): string {
  const features = context.productFeatures?.length 
    ? `\n- Key Features: ${context.productFeatures.join(', ')}`
    : '';

  return `You are a helpful Reddit user who genuinely wants to help people. You work at/use a product and may recommend it when GENUINELY relevant.

## STRICT RULES (MUST FOLLOW):
1. ONLY use information explicitly provided below - NEVER make up features, prices, or claims
2. If the post is NOT relevant to the product, write a helpful reply WITHOUT mentioning it
3. NEVER fabricate user reviews, statistics, or testimonials
4. NEVER claim the product does something not listed in the features
5. Sound like a real person, not a marketer or bot
6. Keep replies under 150 words unless the question needs more detail
7. Match the subreddit's casual tone - use lowercase, contractions, occasional typos are OK
8. If you mention the product, be transparent: "I use X" or "I work on X"

## YOUR PRODUCT (only mention these facts):
- Name: ${context.productName}
- What it does: ${context.productDescription}
- Website: ${context.productWebsite}
- Who it's for: ${context.targetAudience}${features}

## REPLY STYLE: ${context.replyStyle || 'helpful'}
${context.replyStyle === 'casual' ? '- Use casual language, abbreviations, maybe an emoji or two' : ''}
${context.replyStyle === 'technical' ? '- Be precise and detailed, use technical terms appropriately' : ''}
${context.replyStyle === 'empathetic' ? '- Acknowledge their frustration/situation, be supportive first' : ''}
${context.replyStyle === 'helpful' || !context.replyStyle ? '- Be friendly and genuinely helpful, focus on solving their problem' : ''}

## DECISION TREE:
1. Is this post asking about something ${context.productName} actually solves? → Mention it naturally
2. Is this post tangentially related? → Help first, maybe mention as an aside
3. Is this post unrelated to what ${context.productName} does? → Just be helpful, NO product mention`;
}

/**
 * Build the user prompt with the Reddit post context
 */
function buildUserPrompt(context: ReplyContext): string {
  return `Write a Reddit reply for this post. Remember: be authentic, helpful, and only mention the product if it GENUINELY fits.

---
SUBREDDIT: r/${context.subreddit}
POST TITLE: ${context.postTitle}
${context.postBody ? `POST BODY: ${context.postBody}` : '(no body text)'}
---

Write your reply now. Start directly with the reply text (no "Here's a reply:" prefix):`;
}

/**
 * Generate contextual tips based on the reply
 */
function generateTips(context: ReplyContext, reply: string): string[] {
  const tips: string[] = [];
  
  // Check if product was mentioned
  const mentionsProduct = reply.toLowerCase().includes(context.productName.toLowerCase());
  
  if (mentionsProduct) {
    tips.push('Product mentioned - make sure it flows naturally in context');
    tips.push('Consider engaging in the thread first before posting promotional content');
  } else {
    tips.push('No product mention - this builds credibility for future interactions');
  }
  
  tips.push(`Read other comments in r/${context.subreddit} to match the tone`);
  tips.push('Wait a bit before posting - instant replies can look suspicious');
  tips.push('Be ready to follow up if they have questions');
  
  return tips;
}

/**
 * Generate a Reddit reply draft using OpenAI
 */
async function generateWithOpenAI(context: ReplyContext): Promise<GeneratedReply> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const systemPrompt = buildSystemPrompt(context);
  const userPrompt = buildUserPrompt(context);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7, // Slightly lower for more consistent outputs
      max_tokens: 400,
      presence_penalty: 0.1, // Slight penalty to avoid repetition
      frequency_penalty: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const reply = data.choices[0]?.message?.content?.trim() || '';

  return {
    reply,
    tone: context.replyStyle || 'helpful',
    tips: generateTips(context, reply),
    aiConfigured: true,
  };
}

/**
 * Generate a Reddit reply draft using Anthropic Claude
 */
async function generateWithAnthropic(context: ReplyContext): Promise<GeneratedReply> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const systemPrompt = buildSystemPrompt(context);
  const userPrompt = buildUserPrompt(context);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  const reply = data.content[0]?.text?.trim() || '';

  return {
    reply,
    tone: context.replyStyle || 'helpful',
    tips: generateTips(context, reply),
    aiConfigured: true,
  };
}

/**
 * Generate a mock reply for demo/testing
 */
function generateMockReply(context: ReplyContext): GeneratedReply {
  const replies = [
    `Hey! I've been in a similar situation before. What worked for me was taking a more systematic approach to the problem.

I actually started using ${context.productName} a few months ago for exactly this - it's been pretty helpful for ${context.targetAudience.toLowerCase()}. Not saying it's the only solution, but worth checking out if you haven't already.

Happy to share more details about my experience if you're interested!`,

    `Great question! This is something a lot of people struggle with.

From my experience, the key is finding a tool that fits your workflow. I've tried a few different options and ended up settling on ${context.productName} (${context.productWebsite}). It's designed specifically for ${context.targetAudience.toLowerCase()} which made the learning curve pretty smooth.

Let me know if you have specific questions!`,

    `I dealt with this exact problem last year. Here's what I learned:

1. Start by identifying your biggest pain points
2. Look for solutions that address those specifically
3. Don't overcomplicate things early on

For what it's worth, ${context.productName} helped me a lot with this. It's not perfect but it does the job well. You can check it out at ${context.productWebsite}.

Good luck!`,
  ];

  const randomReply = replies[Math.floor(Math.random() * replies.length)];

  return {
    reply: randomReply,
    tone: 'helpful',
    tips: [
      'This is a demo reply - configure OPENAI_API_KEY for real AI generation',
      'Read the thread carefully before posting',
      'Customize the reply to sound more like you',
      'Engage with other comments too',
    ],
    aiConfigured: false,
  };
}

/**
 * Main function to generate a reply
 * Uses OpenAI if configured, falls back to Anthropic, then mock
 */
export async function generateReply(context: ReplyContext): Promise<GeneratedReply> {
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateWithOpenAI(context);
    } catch (error) {
      console.error('OpenAI generation failed:', error);
    }
  }

  // Try Anthropic second
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await generateWithAnthropic(context);
    } catch (error) {
      console.error('Anthropic generation failed:', error);
    }
  }

  // Fall back to mock
  console.log('No AI API configured, using mock reply');
  return generateMockReply(context);
}

/**
 * Check if any AI provider is configured
 */
export function isAIConfigured(): boolean {
  return !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
}
