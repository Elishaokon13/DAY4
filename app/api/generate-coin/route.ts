import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Generate coin name and description from blog content
    const textCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized AI that analyzes blog posts and generates creative cryptocurrency names and descriptions. Make the name unique and related to the content. The description should be concise (50-100 words) and summarize the blog post. Return ONLY a JSON object with 'name' and 'description' fields, nothing else.",
        },
        {
          role: "user",
          content: `Generate a unique coin name and description for this blog post: ${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    // Parse response to get name and description
    let nameAndDescription = { name: '', description: '' };
    try {
      const responseText = textCompletion.choices[0].message.content?.trim() || '';
      nameAndDescription = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Fallback values if parsing fails
      nameAndDescription = {
        name: `BlogCoin_${Math.floor(Math.random() * 1000)}`,
        description: 'A coin representing a unique blog post on the blockchain.'
      };
    }

    // Now generate an image based on the content
    const imageResponse = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        content,
        coinName: nameAndDescription.name 
      }),
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to generate image');
    }

    const { imageUri } = await imageResponse.json();

    return NextResponse.json({
      name: nameAndDescription.name,
      description: nameAndDescription.description,
      imageUri
    });
  } catch (error) {
    console.error('Error generating coin data:', error);
    return NextResponse.json(
      { error: 'Failed to generate coin data' },
      { status: 500 }
    );
  }
} 