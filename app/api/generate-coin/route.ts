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
          content: "You are a specialized AI that analyzes blog posts and generates creative cryptocurrency names and descriptions. Make the name unique and related to the content. The description should be concise (50-100 words) and summarize the blog post. Return ONLY valid JSON with 'name' and 'description' fields in this format: {\"name\": \"CoinName\", \"description\": \"Description here\"}",
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
      // Extract valid JSON from the response by finding content between curly braces
      const jsonMatch = responseText.match(/\{.*\}/s);
      if (jsonMatch) {
        nameAndDescription = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Fallback values if parsing fails
      nameAndDescription = {
        name: `BlogCoin_${Math.floor(Math.random() * 1000)}`,
        description: 'A coin representing a unique blog post on the blockchain.'
      };
    }

    // Get the base URL from the request for absolute URL construction
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Now generate an image based on the content using absolute URL
    const imageResponse = await fetch(`${baseUrl}/api/generate-image`, {
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
      throw new Error(`Failed to generate image: ${await imageResponse.text()}`);
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
      { error: `Failed to generate coin data: ${error.message}` },
      { status: 500 }
    );
  }
} 