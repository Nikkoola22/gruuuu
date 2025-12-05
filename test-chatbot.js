#!/usr/bin/env node

/**
 * Script de test pour vérifier que le chatbot utilise UNIQUEMENT
 * les documents internes (teletravail.ts, formation.ts, temps.ts)
 * et ne fait pas de recherche web.
 * 
 * Usage: node test-chatbot.js
 */

const API_URL = "https://gruuuu.vercel.app/api/perplexity";

// Questions de test avec réponses attendues basées sur teletravail.ts
const tests = [
  {
    id: 1,
    domaine: "Télétravail",
    question: "Combien de jours de forfait annuel ai-je droit pour le télétravail ?",
    reponseAttendue: "15 jours",
    motsCles: ["15", "forfait", "annuel"],
    contexte: "Le protocole Gennevilliers stipule: forfait annuel de 15 jours dans la limite de 3 jours maximum par mois"
  },
  {
    id: 2,
    domaine: "Télétravail",
    question: "Combien de jours fixes de télétravail par semaine sont autorisés ?",
    reponseAttendue: "1 jour fixe par semaine",
    motsCles: ["1 jour", "fixe", "semaine"],
    contexte: "Le protocole stipule: 1 jour fixe par semaine"
  },
  {
    id: 3,
    domaine: "Télétravail",
    question: "Quelle est la présence minimum obligatoire sur site par semaine ?",
    reponseAttendue: "3 jours minimum sur site",
    motsCles: ["3 jours", "présence", "site", "obligatoire"],
    contexte: "La présence de l'agent sur site est obligatoire 3 jours par semaine"
  },
  {
    id: 4,
    domaine: "Télétravail",
    question: "Peut-on télétravailler une demi-journée ?",
    reponseAttendue: "Non, le télétravail n'est pas autorisé pour une demi-journée",
    motsCles: ["non", "demi-journée", "pas autorisé", "interdit"],
    contexte: "Le télétravail n'est pas autorisé pour une demie journée"
  }
];

// Données du fichier teletravail.ts (contexte complet)
const teletravailData = `
PROTOCOLE TÉLÉTRAVAIL - Mairie de Gennevilliers

Le télétravail est limité à 1 jour fixe par semaine accompagné d'un forfait annuel de 15 jours dans la limite de 3 jours maximum par mois.
La présence de l'agent sur site est obligatoire 3 jours par semaine.

A compter du 01 juin 2023, le télétravail évolue à raison d'un jour fixe par semaine accompagné d'un forfait annuel de 15 jours dans la limite de 3 jours maximum par mois.

Le télétravail n'est pas autorisé pour une demie journée.
Le télétravail ne peut être appliqué pour garder ses enfants ou pour couvrir une maladie ordinaire.

L'articulation des jours forfait se fait sur validation hiérarchique 5 jours à l'avance.
`;

const systemPrompt = `Tu es un assistant syndical CFDT spécialiste du télétravail pour la mairie de Gennevilliers.

RÈGLES STRICTES À RESPECTER :
1. Réponds UNIQUEMENT avec les informations du document ci-dessous.
2. NE FAIS JAMAIS de recherche web ou externe.
3. N'utilise JAMAIS tes connaissances générales.
4. Si l'information n'est pas dans le document, dis : "Je ne trouve pas cette information dans le protocole télétravail. Contactez la CFDT au 64 64."

Sois concis et amical. Réponds en français.

--- DOCUMENT OFFICIEL TÉLÉTRAVAIL MAIRIE DE GENNEVILLIERS ---
${teletravailData}
--- FIN DU DOCUMENT ---`;

async function testerQuestion(test) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TEST ${test.id}: ${test.domaine}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`📝 Question: ${test.question}`);
  console.log(`✅ Réponse attendue: ${test.reponseAttendue}`);
  console.log(`🔑 Mots-clés à trouver: ${test.motsCles.join(", ")}`);
  console.log(`\n⏳ Appel API en cours...`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: test.question }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.log(`❌ Erreur API: ${response.status} - ${errText}`);
      return { success: false, error: `API Error ${response.status}` };
    }

    const json = await response.json();
    const reponse = json.choices?.[0]?.message?.content || "Pas de réponse";

    console.log(`\n📤 Réponse du chatbot:`);
    console.log(`"${reponse}"`);

    // Vérifier si les mots-clés attendus sont présents
    const reponseLower = reponse.toLowerCase();
    const motsTrouves = test.motsCles.filter(mot => reponseLower.includes(mot.toLowerCase()));
    const motsManquants = test.motsCles.filter(mot => !reponseLower.includes(mot.toLowerCase()));

    // Vérifier si la réponse contient des indicateurs de recherche web
    const indicateursWeb = [
      "selon des sources",
      "d'après le web",
      "recherche en ligne",
      "sites officiels",
      "fonction publique territoriale",
      "code du travail général",
      "généralement",
      "habituellement",
      "en France",
      "dans la fonction publique"
    ];
    const indicateursTrouves = indicateursWeb.filter(ind => reponseLower.includes(ind.toLowerCase()));

    console.log(`\n📊 Analyse:`);
    console.log(`   Mots-clés trouvés: ${motsTrouves.length}/${test.motsCles.length} (${motsTrouves.join(", ") || "aucun"})`);
    if (motsManquants.length > 0) {
      console.log(`   Mots-clés manquants: ${motsManquants.join(", ")}`);
    }
    
    if (indicateursTrouves.length > 0) {
      console.log(`   ⚠️  ALERTE: Indicateurs de recherche web détectés: ${indicateursTrouves.join(", ")}`);
    }

    const success = motsTrouves.length >= Math.ceil(test.motsCles.length / 2) && indicateursTrouves.length === 0;
    
    if (success) {
      console.log(`\n✅ TEST RÉUSSI - La réponse correspond aux données internes`);
    } else {
      console.log(`\n❌ TEST ÉCHOUÉ - La réponse ne correspond pas aux données internes`);
    }

    return { 
      success, 
      reponse, 
      motsTrouves, 
      motsManquants,
      indicateursWeb: indicateursTrouves
    };

  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║     TEST DU CHATBOT CFDT - DOCUMENTS INTERNES UNIQUEMENT     ║
║              Mairie de Gennevilliers - Télétravail           ║
╚══════════════════════════════════════════════════════════════╝
`);

  console.log(`📡 URL API: ${API_URL}`);
  console.log(`📅 Date du test: ${new Date().toLocaleString("fr-FR")}`);
  console.log(`📋 Nombre de tests: ${tests.length}`);

  const resultats = [];

  for (const test of tests) {
    const resultat = await testerQuestion(test);
    resultats.push({ ...test, ...resultat });
    
    // Pause entre les tests pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Résumé final
  console.log(`\n${"=".repeat(60)}`);
  console.log(`RÉSUMÉ DES TESTS`);
  console.log(`${"=".repeat(60)}`);

  const reussis = resultats.filter(r => r.success).length;
  const echoues = resultats.filter(r => !r.success).length;

  console.log(`\n✅ Tests réussis: ${reussis}/${tests.length}`);
  console.log(`❌ Tests échoués: ${echoues}/${tests.length}`);

  if (reussis === tests.length) {
    console.log(`\n🎉 SUCCÈS TOTAL: Le chatbot utilise bien les documents internes !`);
  } else if (reussis >= tests.length / 2) {
    console.log(`\n⚠️  SUCCÈS PARTIEL: Certaines réponses utilisent peut-être des sources externes.`);
  } else {
    console.log(`\n🚨 ÉCHEC: Le chatbot semble utiliser des sources externes ou le prompt n'est pas respecté.`);
  }

  // Détail des échecs
  const echecs = resultats.filter(r => !r.success);
  if (echecs.length > 0) {
    console.log(`\n📋 Détail des échecs:`);
    echecs.forEach(e => {
      console.log(`   - Test ${e.id}: ${e.question.substring(0, 50)}...`);
      if (e.indicateursWeb?.length > 0) {
        console.log(`     → Indicateurs web détectés: ${e.indicateursWeb.join(", ")}`);
      }
      if (e.error) {
        console.log(`     → Erreur: ${e.error}`);
      }
    });
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`FIN DES TESTS`);
  console.log(`${"=".repeat(60)}\n`);
}

main().catch(console.error);
