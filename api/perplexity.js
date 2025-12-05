// API route pour le chatbot CFDT - Recherche locale + IA pour rédaction
// Étape 1: Recherche dans les documents internes (sans web)
// Étape 2: Rédaction avec IA basée UNIQUEMENT sur les extraits trouvés

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

  if (!API_KEY) {
    console.error('[Perplexity API] Clé API Perplexity manquante');
    return res.status(500).json({ error: 'API key not configured.' });
  }

  try {
    // Extraire le contexte du system prompt
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessage = messages.find(m => m.role === 'user');
    
    if (!systemMessage || !userMessage) {
      return res.status(400).json({ error: 'Missing system or user message' });
    }

    // Extraire le document interne du prompt
    const docMatch = systemMessage.content.match(/--- DOCUMENT OFFICIEL[\s\S]*?---\n([\s\S]*?)\n--- FIN DU DOCUMENT ---/);
    const documentInterne = docMatch ? docMatch[1] : '';
    
    console.log('[API] Document interne trouvé:', documentInterne.length, 'caractères');

    // ÉTAPE 1: Utiliser un modèle CHAT (pas search) pour répondre
    // Le modèle "llama-3.1-sonar-small-128k-chat" ne fait PAS de recherche web
    const chatPrompt = `Tu es un assistant syndical CFDT pour la mairie de Gennevilliers.

RÈGLES ABSOLUES:
1. Tu dois répondre UNIQUEMENT avec les informations du document ci-dessous.
2. Ne fais AUCUNE recherche externe.
3. N'utilise AUCUNE connaissance générale.
4. Cite les chiffres et règles EXACTEMENT comme dans le document.
5. Si l'info n'est pas dans le document, dis: "Cette information n'est pas dans le protocole Gennevilliers. Contactez la CFDT au 64 64."

DOCUMENT OFFICIEL MAIRIE DE GENNEVILLIERS:
"""
${documentInterne}
"""

Question de l'agent: ${userMessage.content}

Réponds de façon concise et amicale en français, en citant les informations du document ci-dessus.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Utiliser le modèle CHAT qui ne fait pas de recherche web
        model: 'llama-3.1-sonar-small-128k-chat',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un assistant qui répond UNIQUEMENT à partir du document fourni. Ne fais jamais de recherche web. Ne cite jamais de sources externes [1][2]. Réponds en français.'
          },
          { 
            role: 'user', 
            content: chatPrompt 
          }
        ],
        temperature: 0.1, // Température basse pour des réponses factuelles
        max_tokens: 1000
      })
    });

    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[API] Error:', response.status, error);
      
      // Si le modèle chat n'est pas disponible, fallback vers sonar avec température 0
      if (response.status === 400 || response.status === 404) {
        console.log('[API] Fallback vers sonar avec température minimale');
        
        const fallbackResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { 
                role: 'system', 
                content: `IMPORTANT: Ne fais AUCUNE recherche web. Réponds UNIQUEMENT avec ce document:

${documentInterne}

Si tu ne trouves pas l'info dans ce texte, dis "Information non trouvée dans le protocole Gennevilliers".`
              },
              { role: 'user', content: userMessage.content }
            ],
            temperature: 0,
            max_tokens: 800
          })
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let content = fallbackData.choices?.[0]?.message?.content || '';
          
          // Nettoyer les références web [1], [2], etc.
          content = content.replace(/\[\d+\]/g, '');
          content = content.replace(/\[Source[^\]]*\]/gi, '');
          
          return res.status(200).json({
            choices: [{ message: { content } }]
          });
        }
      }
      
      return res.status(response.status).json({ error: 'API error: ' + response.status });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    // Nettoyer les références web [1], [2], etc. au cas où
    content = content.replace(/\[\d+\]/g, '');
    content = content.replace(/\[Source[^\]]*\]/gi, '');
    
    console.log('[API] Réponse nettoyée:', content.substring(0, 100) + '...');
    
    return res.status(200).json({
      choices: [{ message: { content } }]
    });
    
  } catch (error) {
    console.error('[API] Exception:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
