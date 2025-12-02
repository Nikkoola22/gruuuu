// API route pour appeler Perplexity depuis le serveur (évite les problèmes CORS)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const API_KEY = process.env.VITE_APP_PERPLEXITY_KEY;

  if (!API_KEY) {
    console.error('Clé API Perplexity manquante');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
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
      return res.status(response.status).json({ error: `API returned ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de l\'appel Perplexity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
