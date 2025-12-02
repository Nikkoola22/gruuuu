import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// OPTIONS pour CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const API_KEY = process.env.VITE_APP_PERPLEXITY_KEY;

    if (!API_KEY) {
      console.error('Clé API Perplexity manquante');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500, headers: corsHeaders() }
      );
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Perplexity API error: ${response.status}`, error);
      return NextResponse.json(
        { error: `API returned ${response.status}` },
        { status: response.status, headers: corsHeaders() }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (error) {
    console.error('Erreur lors de l\'appel Perplexity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
