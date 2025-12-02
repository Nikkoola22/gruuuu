import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Essayer plusieurs noms de variable d'env
    const API_KEY = process.env.VITE_APP_PERPLEXITY_KEY || 
                    process.env.PERPLEXITY_API_KEY || 
                    process.env.PERPLEXITY_KEY;

    console.log('[Perplexity API] Checking API key...');
    console.log('[Perplexity API] VITE_APP_PERPLEXITY_KEY exists:', !!process.env.VITE_APP_PERPLEXITY_KEY);
    console.log('[Perplexity API] PERPLEXITY_API_KEY exists:', !!process.env.PERPLEXITY_API_KEY);

    if (!API_KEY) {
      console.error('[Perplexity API] No API key found in environment variables');
      return NextResponse.json(
        { error: 'Clé API Perplexity non configurée' },
        { status: 500, headers: corsHeaders() }
      );
    }

    console.log('[Perplexity API] Calling Perplexity API...');
    
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

    console.log('[Perplexity API] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error(`[Perplexity API] Error ${response.status}:`, error);
      return NextResponse.json(
        { error: `Perplexity API error: ${response.status}` },
        { status: response.status, headers: corsHeaders() }
      );
    }

    const data = await response.json();
    console.log('[Perplexity API] Success');
    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (error) {
    console.error('[Perplexity API] Exception:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500, headers: corsHeaders() }
    );
  }
}
