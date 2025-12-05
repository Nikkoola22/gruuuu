// API route pour le chatbot CFDT - Recherche locale UNIQUEMENT
// Le modèle doit STRICTEMENT utiliser les documents internes

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
    const docMatch = systemMessage.content.match(/--- DEBUT DE LA DOCUMENTATION PERTINENTE ---\n([\s\S]*?)\n--- FIN DE LA DOCUMENTATION PERTINENTE ---/);
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

    // PROMPT ULTRA-STRICT - Forcer le modèle à n'utiliser QUE le document
    const strictSystemPrompt = `INSTRUCTIONS CRITIQUES - À SUIVRE ABSOLUMENT:

Tu es un assistant qui répond UNIQUEMENT en extrayant des informations du DOCUMENT CI-DESSOUS.

RÈGLES OBLIGATOIRES:
1. Tu ne peux citer QUE des informations présentes dans le document ci-dessous
2. Si l'information demandée N'EST PAS dans le document, tu DOIS répondre: "Je ne trouve pas cette information dans les documents. Contactez la CFDT au 64 64."
3. INTERDICTION ABSOLUE d'utiliser tes connaissances générales
4. INTERDICTION de comparer avec d'autres entreprises ou la fonction publique en général
5. Cite les chiffres et règles EXACTEMENT comme dans le document
6. Sois concis et amical

======= DÉBUT DU DOCUMENT OFFICIEL MAIRIE DE GENNEVILLIERS =======
${documentInterne}
======= FIN DU DOCUMENT OFFICIEL =======`;

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
            content: strictSystemPrompt
          },
          { 
            role: 'user', 
            content: `Question: ${userMessage.content}

RAPPEL: Réponds UNIQUEMENT avec les informations du document ci-dessus. Si tu ne trouves pas l'info, dis "Je ne trouve pas cette information dans les documents. Contactez la CFDT au 64 64."`
          }
        ],
        temperature: 0,
        max_tokens: 600
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
    
    // Nettoyer les réponses - supprimer tout ce qui ressemble à des sources web ou comparaisons
    content = content.replace(/\[\d+\]/g, '');
    content = content.replace(/\[Source[^\]]*\]/gi, '');
    content = content.replace(/\[PROTOCOLE[^\]]*\]/gi, '');
    content = content.replace(/Dans la fonction publique[^.]*\./gi, '');
    content = content.replace(/En général[^.]*\./gi, '');
    content = content.replace(/Généralement[^.]*\./gi, '');
    content = content.replace(/Cette règle est spécifique[^.]*\./gi, '');
    content = content.replace(/peut différer[^.]*\./gi, '');
    content = content.replace(/selon la loi[^.]*\./gi, '');
    content = content.replace(/selon le code du travail[^.]*\./gi, '');
    content = content.replace(/conformément à la réglementation[^.]*\./gi, '');
    
    // Si la réponse contient des indicateurs de connaissances générales, la remplacer
    const indicateursWeb = [
      'selon la législation',
      'dans le secteur public',
      'habituellement',
      'en règle générale',
      'la plupart des',
      'selon les textes',
      'le droit du travail prévoit'
    ];
    
    const contientIndicateurWeb = indicateursWeb.some(ind => 
      content.toLowerCase().includes(ind.toLowerCase())
    );
    
    if (contientIndicateurWeb) {
      console.log('[API] Détection de connaissances générales, nettoyage...');
      // Garder seulement la partie avant l'indicateur ou demander de reformuler
      for (const ind of indicateursWeb) {
        const idx = content.toLowerCase().indexOf(ind.toLowerCase());
        if (idx > 50) {
          content = content.substring(0, idx).trim();
          break;
        }
      }
    }
    
    console.log('[API] Réponse finale:', content.substring(0, 100) + '...');
    
    return res.status(200).json({
      choices: [{ message: { content: content.trim() } }]
    });
    
  } catch (error) {
    console.error('[API] Exception:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
