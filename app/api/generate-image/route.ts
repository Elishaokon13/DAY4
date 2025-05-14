import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content, coinName } = await request.json();

    if (!content && !coinName) {
      return NextResponse.json(
        { error: 'Content or coin name is required' },
        { status: 400 }
      );
    }

    // Create a default coin name if not provided
    const effectiveCoinName = coinName || `BlogCoin_${Math.floor(Math.random() * 1000)}`;
    
    // Use a shorter content excerpt for prompt generation
    const contentExcerpt = content ? content.slice(0, 500) + '...' : 'A blog post about cryptocurrency';

    try {
      // First, generate a prompt for the image based on the blog content
      const promptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a specialized AI that creates descriptive image prompts. Create a detailed prompt for a 512x512 image representing the essence of a cryptocurrency coin for a blog post. The prompt should describe a professional, minimalist design that would work well for a coin logo or icon. Be creative but focused. ONLY return the prompt itself without any explanations or additional text.",
          },
          {
            role: "user",
            content: `Create an image prompt for a cryptocurrency coin named "${effectiveCoinName}" based on this blog post content: ${contentExcerpt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const imagePrompt = promptResponse.choices[0].message.content?.trim() || 
        `A minimalist, professional cryptocurrency coin logo for "${effectiveCoinName}", with subtle gradient, modern design elements, on a dark background`;

      // Use the generated prompt to create an image with DALL-E
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      });

      const imageUrl = imageResponse.data[0].url;

      // Return the image URL
      return NextResponse.json({
        imageUri: imageUrl,
        prompt: imagePrompt // Include the prompt for debugging
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Return a fallback image URL for development purposes
      return NextResponse.json({
        imageUri: "https://placehold.co/1024x1024/14b8a6/ffffff?text=BlogCoin",
        error: `OpenAI error: ${openaiError.message}`
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        error: `Failed to generate image: ${error.message}`,
        imageUri: "https://placehold.co/1024x1024/14b8a6/ffffff?text=Error" // Fallback image
      },
      { status: 500 }
    );
  }
} 