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
          content: `Create an image prompt for a cryptocurrency coin named "${coinName}" based on this blog post content: ${content.slice(0, 1000)}...`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const imagePrompt = promptResponse.choices[0].message.content?.trim() || 
      `A minimalist, professional cryptocurrency coin logo for "${coinName}", with subtle gradient, modern design elements, on a dark background`;

    // Use the generated prompt to create an image with DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = imageResponse.data[0].url;

    // At this point, you'd typically upload this image to IPFS via Pinata
    // But for this endpoint, we'll just return the URL from OpenAI
    // The IPFS upload will happen in the upload-to-ipfs endpoint

    return NextResponse.json({
      imageUri: imageUrl
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 