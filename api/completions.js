import dotenv from 'dotenv';
import { handleCors, sanitizeCompletionRequest, summarizeCompletionRequest } from './_security.js';

// Support local runs (e.g. vercel dev) by loading .env and .env.local.
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

export default async function handler(req, res) {
  if (!handleCors(req, res, ['POST', 'OPTIONS'])) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const completionBody = sanitizeCompletionRequest(req.body);

  if (!completionBody) {
    return res.status(400).json({ error: 'Invalid completion payload' });
  }

  console.log('📝 Requête IA reçue:', summarizeCompletionRequest(completionBody));
  
  // Vérifier que la clé API existe
  if (!process.env.PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY n\'est pas définie');
    return res.status(200).json({
      id: 'fallback-no-api-key',
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: completionBody.model || 'fallback-local',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: "Le service de réponse IA externe n'est pas configuré (PERPLEXITY_API_KEY manquante). La recherche interne de l'application reste disponible."
          },
          finish_reason: 'stop'
        }
      ]
    });
  }
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    const modifiedBody = {
      ...completionBody,
      return_images: false,
      return_related_questions: false,
      max_tokens: 2000,
      temperature: 0.0,
      search_recency_filter: "month",
      return_citations: true,
      search_domain_filter: ["ville-gennevilliers.fr", "cfdt.fr"],
      pplx_model: "llama-3.1-sonar-large-32k-online"
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(modifiedBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📡 Statut réponse Perplexity:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Erreur Perplexity:', text);

      try {
        const errorJson = JSON.parse(text);
        return res.status(response.status).json({
          error: errorJson.error || 'Perplexity API error',
          details: errorJson.message || response.statusText,
        });
      } catch {
        return res.status(response.status).json({
          error: 'Perplexity API error',
          details: response.statusText,
        });
      }
    }

    const data = await response.json();
    console.log('✅ Réponse Perplexity reçue');
    res.status(200).json(data);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("⏱️ Timeout: Requête Perplexity dépassée (30s)");
      return res.status(200).json({
        id: 'fallback-timeout',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: completionBody.model || 'fallback-local',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: "Le service IA externe a dépassé le délai. Réessayez dans un instant."
            },
            finish_reason: 'stop'
          }
        ]
      });
    }
    console.error("💥 Erreur serveur:", error);
    res.status(200).json({
      id: 'fallback-server-error',
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: completionBody.model || 'fallback-local',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: "Le service IA externe est temporairement indisponible."
          },
          finish_reason: 'stop'
        }
      ]
    });
  }
}
