// API route pour le chatbot CFDT - Recherche locale uniquement
// Modèle CHAT (pas search) pour éviter toute recherche web

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
  
  const API_KEY = process.env.VITE_APP_PERPLEXITY_KEY || process.env.PERPLEXITY_API_KEY || process.env.VITE_API_KEY;

  if (!API_KEY) {
    console.error('[Perplexity API] Clé API Perplexity manquante');
    return res.status(500).json({ error: 'API key not configured.' });
  }

  try {
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessage = messages.find(m => m.role === 'user');
    
    if (!systemMessage || !userMessage) {
      return res.status(400).json({ error: 'Missing system or user message' });
    }

    // Extraire le document interne du prompt
    const docMatch = systemMessage.content.match(/--- DOCUMENT OFFICIEL[\s\S]*?---\n([\s\S]*?)\n--- FIN DU DOCUMENT ---/);
    const documentInterne = docMatch ? docMatch[1] : '';
    
    console.log('[API] Document interne trouvé:', documentInterne.length, 'caractères');
    
    // Prompt ultra-strict pour éviter toute recherche externe
    const chatPrompt = `Tu es un assistant syndical CFDT pour la mairie de Gennevilliers.

CONSIGNES ABSOLUES ET NON NÉGOCIABLES:
- Réponds UNIQUEMENT avec les informations ci-dessous.
- N'ajoute JAMAIS de comparaison avec d'autres entreprises ou la fonction publique en général.
- N'ajoute JAMAIS d'informations que tu ne trouves pas dans le document.
- Cite les chiffres EXACTEMENT comme dans le document.
- Reste factuel et concis.
- Si l'info n'est pas dans le document, dis: "Cette information n'est pas dans le protocole Gennevilliers. Contactez la CFDT au 64 64."

DOCUMENT OFFICIEL MAIRIE DE GENNEVILLIERS:
"""
${documentInterne}
"""

Question de l'agent: ${userMessage.content}

Réponds de façon concise et amicale, UNIQUEMENT avec les infos du document ci-dessus.`;

    // Utiliser le modèle CHAT (pas search) - ne fait pas de recherche web
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-chat',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un assistant CFDT qui répond UNIQUEMENT avec le document fourni. Ne fais jamais de recherche externe. Ne compare jamais avec la fonction publique en général.'
          },
          { 
            role: 'user', 
            content: chatPrompt 
          }
        ],
        temperature: 0, // Température 0 pour des réponses strictement factuelles
        max_tokens: 800
      })
    });

    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[API] Error:', response.status, error);
      
      // Fallback vers sonar
      if (response.status === 400 || response.status === 404) {
        console.log('[API] Fallback vers sonar');
        
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
                content: `IMPORTANT: Réponds UNIQUEMENT avec ce document. N'ajoute rien d'externe:

${documentInterne}

Si tu ne trouves pas l'info, dis "Information non trouvée dans le protocole Gennevilliers. Contactez la CFDT au 64 64."`
              },
              { role: 'user', content: userMessage.content }
            ],
            temperature: 0,
            max_tokens: 600
          })
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let content = fallbackData.choices?.[0]?.message?.content || '';
          
          // Nettoyer les références web
          content = content.replace(/\[\d+\]/g, '');
          content = content.replace(/\[Source[^\]]*\]/gi, '');
          content = content.replace(/Dans la fonction publique[^.]*\./gi, '');
          content = content.replace(/En général[^.]*\./gi, '');
          
          return res.status(200).json({
            choices: [{ message: { content } }]
          });
        }
      }
      
      return res.status(response.status).json({ error: 'API error: ' + response.status });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    // Nettoyer les références web et les comparaisons générales
    content = content.replace(/\[\d+\]/g, '');
    content = content.replace(/\[Source[^\]]*\]/gi, '');
    content = content.replace(/\[PROTOCOLE[^\]]*\]/gi, '');
    content = content.replace(/Dans la fonction publique[^.]*\./gi, '');
    content = content.replace(/En général[^.]*\./gi, '');
    content = content.replace(/Cette règle est spécifique[^.]*\./gi, '');
    content = content.replace(/peut différer[^.]*\./gi, '');
    
    console.log('[API] Réponse nettoyée:', content.substring(0, 100) + '...');
    
    return res.status(200).json({
      choices: [{ message: { content: content.trim() } }]
    });
    
  } catch (error) {
    console.error('[API] Exception:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
