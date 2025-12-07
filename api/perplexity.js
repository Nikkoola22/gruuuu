// API route pour le chatbot CFDT - Documents internes UNIQUEMENT
// Utilise le modèle sonar avec prompt ultra-strict

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

    // Extraire le document interne du prompt (format App.tsx)
    const docMatch = systemMessage.content.match(/--- DOCUMENT OFFICIEL [^-]+ ---\n([\s\S]*?)\n--- FIN DU DOCUMENT ---/);
    const documentInterne = docMatch ? docMatch[1] : '';
    
    console.log('[API] Document interne trouvé:', documentInterne.length, 'caractères');
    
    // Si pas de document, répondre directement
    if (!documentInterne || documentInterne.trim().length < 50) {
      return res.status(200).json({
        choices: [{ 
          message: { 
            content: "Je ne trouve pas l'information dans les documents à ma disposition. Veuillez contacter la CFDT au 64 64 pour plus de détails." 
          } 
        }]
      });
    }

    // PROMPT ULTRA-STRICT pour forcer le modèle à n'utiliser QUE le document
    const strictSystemPrompt = `RÔLE: Assistant CFDT Mairie de Gennevilliers.

DOCUMENT INTERNE (SEULE SOURCE AUTORISÉE):
<<<
${documentInterne}
>>>

RÈGLES ABSOLUES:
- Réponds UNIQUEMENT avec les infos du document ci-dessus
- JAMAIS de recherche web
- JAMAIS de connaissances générales
- Si info absente: "Contactez la CFDT au 64 64"
- Réponse courte et précise`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: strictSystemPrompt },
          { role: 'user', content: userMessage.content }
        ],
        temperature: 0,
        max_tokens: 400,
        
      })
    });

    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[API] Error:', response.status, error);
      return res.status(response.status).json({ error: 'API error: ' + response.status });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    // Nettoyer les réponses - supprimer sources web et comparaisons
    content = content.replace(/\[\d+\]/g, '');
    content = content.replace(/\[Source[^\]]*\]/gi, '');
    content = content.replace(/Selon (le web|internet|les recherches|mes recherches)[^.]*\./gi, '');
    content = content.replace(/D'après (le web|internet|les recherches)[^.]*\./gi, '');
    content = content.replace(/Dans la fonction publique[^.]*\./gi, '');
    content = content.replace(/En général[^.]*\./gi, '');
    content = content.replace(/Généralement[^.]*\./gi, '');
    
    console.log('[API] Réponse finale:', content.substring(0, 100) + '...');
    
    return res.status(200).json({
      choices: [{ message: { content: content.trim() } }]
    });
    
  } catch (error) {
    console.error('[API] Exception:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
