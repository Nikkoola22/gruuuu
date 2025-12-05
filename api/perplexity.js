// API route pour appeler Perplexity depuis le serveur Vercel (évite les problèmes CORS)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  
  // Essayer les différents noms de variable d'environnement possibles
  const API_KEY = process.env.VITE_APP_PERPLEXITY_KEY || process.env.PERPLEXITY_API_KEY || process.env.VITE_API_KEY;

  console.log('[Perplexity API] Keys available:', {
    VITE_APP_PERPLEXITY_KEY: !!process.env.VITE_APP_PERPLEXITY_KEY,
    PERPLEXITY_API_KEY: !!process.env.PERPLEXITY_API_KEY,
    VITE_API_KEY: !!process.env.VITE_API_KEY
  });

  if (!API_KEY) {
    console.error('[Perplexity API] Clé API Perplexity manquante');
    return res.status(500).json({ error: 'API key not configured. Please set VITE_APP_PERPLEXITY_KEY in Vercel environment variables.' });
  }

  try {
    console.log('[Perplexity API] Calling Perplexity with', messages.length, 'messages');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
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
      console.error('[Perplexity API] Error ' + response.status + ':', error);
      return res.status(response.status).json({ error: 'Perplexity API returned ' + response.status + ': ' + error });
    }

    const data = await response.json();
    console.log('[Perplexity API] Success, got response');
    return res.status(200).json(data);
  } catch (error) {
    console.error('[Perplexity API] Exception:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
