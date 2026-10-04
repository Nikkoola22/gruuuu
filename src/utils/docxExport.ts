/**
 * Générateur et Exportateur officiel de documents .DOCX
 * Conforme à la Charte Bureautique de la Ville de Gennevilliers
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { saveAs } from 'file-saver';

export interface DocxGenerationOptions {
  title: string;
  category?: string;
  content: string;
  rawText: string;
  docType?: 'arrete' | 'decision' | 'contrat' | 'circulaire' | 'deliberation';
}

/**
 * Détecte la typologie de l'acte administratif
 */
export function detectDocumentType(rawText: string): 'arrete' | 'decision' | 'contrat' | 'circulaire' | 'deliberation' {
  if (rawText.includes("NOTE DE SERVICE") || rawText.includes("CIRCULAIRE")) return 'circulaire';
  if (rawText.includes("CONTRAT D'ENGAGEMENT") || rawText.includes("CONTRAT")) return 'contrat';
  if (rawText.includes("DÉLIBÉRATION") || rawText.includes("CONSEIL MUNICIPAL")) return 'deliberation';
  if (rawText.includes("DÉCISION DU MAIRE") || rawText.includes("DÉCIDE :")) return 'decision';
  return 'arrete';
}

/**
 * Génère et télécharge un fichier .docx officiel mis en page selon la charte bureautique
 */
export async function exportToOfficialDocx(options: DocxGenerationOptions): Promise<void> {
  const { title, rawText } = options;
  const docType = options.docType || detectDocumentType(rawText);

  const lines = rawText.split('\n');
  const docParagraphs: Paragraph[] = [];

  // 1. EN-TÊTE OFFICIEL DE LA VILLE DE GENNEVILLIERS
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "RÉPUBLIQUE FRANÇAISE",
          bold: true,
          size: 20,
          color: "666666",
          font: "Arial"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "VILLE DE GENNEVILLIERS",
          bold: true,
          size: 28,
          color: "0B3C5D", // Bleu institutionnel Gennevilliers
          font: "Arial"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "DIRECTION GÉNÉRALE DES SERVICES  •  DIRECTION DES RESSOURCES HUMAINES",
          bold: true,
          size: 16,
          color: "4A6984",
          font: "Arial"
        })
      ],
      border: {
        bottom: {
          color: "0B3C5D",
          space: 6,
          style: BorderStyle.SINGLE,
          size: 12
        }
      }
    }),
    new Paragraph({ spacing: { after: 180 }, children: [] })
  );

  // 2. PARCOURS DES LIGNES DU TEXTE POUR APPLIQUER LA MISE EN PAGE OFFICIELLE
  for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i].trim();
    if (!rawLine) {
      docParagraphs.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      continue;
    }

    // 1. Suppression des mentions redondantes Gennevilliers / République / Logo Ville Populaire / Tampon
    if (
      /Gennevilliers\s+RÉPUBLIQUE FRANÇAISE/i.test(rawLine) ||
      /Logo Ville Populaire/i.test(rawLine) ||
      /LIBERTÉ\s*-\s*ÉGALITÉ\s*-\s*FRATERNITÉ/i.test(rawLine) ||
      /\[?Tampon officiel/i.test(rawLine) ||
      /Tampon officiel Ville de Gennevilliers/i.test(rawLine)
    ) {
      continue;
    }

    rawLine = rawLine
      .replace(/\s*\[ou Zineb ZOUAOUI\]/gi, '')
      .replace(/\s*\[ou Madame ZOUAOUI Zineb, adjointe au Maire\]/gi, '')
      .trim();

    // 2. Titre d'acte et sous-titres (CONTRAT, ARRÊTÉ, DÉCISION, etc.) - EN GRAS ET CENTRÉ
    if (
      rawLine.startsWith("ARRÊTÉ DU MAIRE") ||
      rawLine.startsWith("ARRÊTÉ") ||
      rawLine.startsWith("DÉCISION DU MAIRE") ||
      rawLine.startsWith("DÉCISION") ||
      rawLine.startsWith("CONTRAT") ||
      rawLine.startsWith("POUR ASSURER LE REMPLACEMENT") ||
      rawLine.startsWith("POUR FAIRE FACE") ||
      rawLine.startsWith("SUR UN EMPLOI PERMANENT") ||
      rawLine.startsWith("POUR LA CONDUITE") ||
      rawLine === "MEDECIN VACATAIRE" ||
      rawLine.startsWith("NOTE DE SERVICE") ||
      rawLine.startsWith("CIRCULAIRE") ||
      rawLine.startsWith("EXTRAIT DU REGISTRE") ||
      rawLine.startsWith("RAPPORT HIÉRARCHIQUE") ||
      rawLine.startsWith("CERTIFICAT DE TRAVAIL") ||
      rawLine.startsWith("ACTE D'ENGAGEMENT") ||
      rawLine.startsWith("FORMULAIRE ATTRI1") ||
      rawLine.startsWith("AVENANT N°") ||
      rawLine.startsWith("ORDRE DE SERVICE") ||
      rawLine.startsWith("PROCÈS-VERBAL") ||
      rawLine.startsWith("COMPTE-RENDU D'ENTRETIEN") ||
      rawLine.startsWith("FICHE DE COTATION")
    ) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 100 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 24,
              color: "0B3C5D",
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // 3. Mention légale entre parenthèses sous le titre (ex: (Etabli en application des dispositions de l'article L332-13...)) - EN GRAS ET CENTRÉ
    if (
      rawLine.startsWith("(") && rawLine.endsWith(")") &&
      (
        rawLine.toLowerCase().includes("application") ||
        rawLine.toLowerCase().includes("article l") ||
        rawLine.toLowerCase().includes("code général") ||
        rawLine.toLowerCase().includes("cgfp") ||
        rawLine.toLowerCase().includes("décret")
      )
    ) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 180 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 20,
              color: "2D3748",
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Portant ... (Objet)
    if (rawLine.startsWith("Portant ") || rawLine.startsWith("OBJET :") || rawLine.startsWith("Objet :")) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              italics: true,
              size: 21,
              color: "1A202C",
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Le Maire de Gennevilliers / Les soussignés
    if (
      rawLine === "Le Maire de Gennevilliers," ||
      rawLine === "Le Maire de Gennevilliers" ||
      rawLine.startsWith("Entre les soussignés")
    ) {
      docParagraphs.push(
        new Paragraph({
          spacing: { before: 180, after: 120 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 21,
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Visas (Vu ..., Considérant ...)
    if (rawLine.startsWith("Vu ") || rawLine.startsWith("Considérant ")) {
      docParagraphs.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: rawLine.substring(0, rawLine.indexOf(" ") + 1),
              bold: true,
              size: 20,
              font: "Arial"
            }),
            new TextRun({
              text: rawLine.substring(rawLine.indexOf(" ") + 1),
              size: 20,
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Mot d'action (ARRÊTE :, DÉCIDE :, IL EST CONVENU CE QUI SUIT :)
    if (
      rawLine === "ARRÊTE :" ||
      rawLine === "DÉCIDE :" ||
      rawLine === "IL EST CONVENU CE QUI SUIT :" ||
      rawLine.includes("DÉCIDE :")
    ) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 200 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 22,
              color: "0B3C5D",
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Articles (ARTICLE 1 ..., Article 2 ..., etc.)
    if (/^(ARTICLE|Article)\s+\d+/i.test(rawLine)) {
      const match = rawLine.match(/^(ARTICLE|Article)\s+\d+[^:]*:/i);
      if (match) {
        const prefix = match[0];
        const rest = rawLine.substring(prefix.length);
        docParagraphs.push(
          new Paragraph({
            spacing: { before: 160, after: 100 },
            children: [
              new TextRun({
                text: prefix + " ",
                bold: true,
                size: 20,
                color: "0B3C5D",
                font: "Arial"
              }),
              new TextRun({
                text: rest.trim(),
                size: 20,
                font: "Arial"
              })
            ]
          })
        );
        continue;
      }
    }

    // Date & Lieu officiel
    if (rawLine.startsWith("Fait à Gennevilliers") || rawLine.startsWith("Fait en Mairie")) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: rawLine,
              italics: true,
              size: 20,
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Signature de l'agent / intéressé
    if (rawLine.startsWith("Signature de l'intéressé") || rawLine.startsWith("Signature de l'agent")) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 80 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 20,
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Signature Block officiel (Pour le Maire, Pierric ANNOOT, Adjoint au Maire...)
    if (
      rawLine.startsWith("Pour le Maire") ||
      rawLine.startsWith("Pierric ANNOOT") ||
      rawLine.startsWith("Adjoint au Maire") ||
      rawLine.startsWith("12ᵉ Adjoint") ||
      rawLine.startsWith("12ème Adjoint") ||
      rawLine.includes("Adjoint au Maire") ||
      rawLine === "Adjoint RH" ||
      rawLine.startsWith("Soraya FONTAINE") ||
      rawLine.startsWith("Patrice LECLERC") ||
      rawLine.startsWith("Directrice Générale")
    ) {
      const isTopLine = rawLine.startsWith("Pour le Maire");
      const isNameLine = rawLine.startsWith("Pierric ANNOOT") || rawLine.startsWith("Patrice LECLERC") || rawLine.startsWith("Soraya FONTAINE");
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: isTopLine ? 180 : 30, after: 30 },
          children: [
            new TextRun({
              text: rawLine,
              bold: true,
              size: 20,
              color: isNameLine ? "0B3C5D" : "1A202C",
              font: "Arial"
            })
          ]
        })
      );
      continue;
    }

    // Ligne standard
    docParagraphs.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: rawLine,
            size: 20,
            font: "Arial"
          })
        ]
      })
    );
  }

  // 3. CONSTRUCTION DU DOCUMENT DOCX AVEC PIED DE PAGE CHARTE
  const doc = new Document({
    title: title,
    description: `Acte administratif officiel généré - Ville de Gennevilliers (${docType})`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 2.5 cm (1 inch = 1440 twips)
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Mairie de Gennevilliers • Document Officiel RH",
                    size: 16,
                    color: "888888",
                    font: "Arial"
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Hôtel de Ville de Gennevilliers — 177, avenue Gabriel-Péri, 92230 Gennevilliers  •  Page ",
                    size: 16,
                    color: "888888",
                    font: "Arial"
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: "888888",
                    font: "Arial"
                  })
                ]
              })
            ]
          })
        },
        children: docParagraphs
      }
    ]
  });

  // 4. GÉNÉRATION DU FICHIER ET TÉLÉCHARGEMENT
  const blob = await Packer.toBlob(doc);
  const cleanFileName = `Gennevilliers_${docType.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.docx`;
  saveAs(blob, cleanFileName);
}

/**
 * Raccourci pour exporter directement un StatutoryQueryResult au format .docx
 */
export async function exportStatutoryActToDocx(result: { title: string; category?: string; sampleDocument?: string; content?: string }): Promise<void> {
  return exportToOfficialDocx({
    title: result.title,
    category: result.category,
    content: result.content || result.title,
    rawText: result.sampleDocument || result.content || result.title
  });
}

/**
 * Générateur officiel du Formulaire de Temps Partiel (De Droit & Sur Autorisation)
 * Conforme CGFP Art. L. 612-1 à L. 612-14 et Décret n° 2004-777
 */
export async function exportTempsPartielFormDocx(variant: 'de_droit' | 'autorisation' = 'de_droit'): Promise<void> {
  const isDroit = variant === 'de_droit';
  const title = isDroit 
    ? "Formulaire de Demande de Temps Partiel de Droit - Ville de Gennevilliers"
    : "Formulaire de Demande de Temps Partiel sur Autorisation - Ville de Gennevilliers";

  const rawText = isDroit ? `VILLE DE GENNEVILLIERS - DIRECTION DES RESSOURCES HUMAINES
FORMULAIRE OFFICIEL : DEMANDE D'EXERCICE DES FONCTIONS À TEMPS PARTIEL DE DROIT
(Code Général de la Fonction Publique, Art. L. 612-2 à L. 612-4 & Décret n° 2004-777 du 29 juillet 2004)

1. IDENTIFICATION DE L'AGENT(E)
Nom de naissance : ___________________________   Nom d'usage : ___________________________
Prénom : _____________________________________   Matricule RH : ___________________________
Direction / Pôle : ___________________________   Service : _______________________________
Grade / Emploi : _____________________________   Fonctions exercées : ____________________
Téléphone pro : ______________________________   Courriel : ______________________________

2. MOTIF LÉGAL DE LA DEMANDE (TEMPS PARTIEL DE DROIT)
Cocher le motif justifiant le bénéfice du temps partiel de droit :
[  ] À l'occasion de chaque naissance (jusqu'aux 3 ans de l'enfant) ou d'une adoption (délai de 3 ans)
     Nom et prénom de l'enfant : _______________________   Date de naissance/arrivée : ___/___/______
[  ] Pour donner des soins au conjoint, partenaire de PACS ou concubin atteint d'un handicap ou maladie grave
[  ] Pour donner des soins à un enfant à charge atteint d'un handicap ou victime d'un accident/maladie grave
[  ] Pour donner des soins à un ascendant (père, mère) atteint d'un handicap ou perte d'autonomie
[  ] En qualité de travailleur handicapé (bénéficiaire de l'art. L. 351-1 du CGFP)

3. MODALITÉS & QUOTITÉ DU TEMPS DE TRAVAIL SOLLICITÉ
Quotité souhaitée :
[  ] 50 % d'un temps plein (17h30 hebdomadaires)
[  ] 60 % d'un temps plein (21h00 hebdomadaires)
[  ] 70 % d'un temps plein (24h30 hebdomadaires)
[  ] 80 % d'un temps plein (28h00 hebdomadaires — Rémunération avantageuse à 85,7% soit 6/7e)

Période d'effet demandée :
Du ___ / ___ / 202___ au ___ / ___ / 202___ (Période comprise entre 6 mois et 1 an renouvelable)

Répartition hebdomadaire proposée des journées / demi-journées non travaillées :
- Lundi :    [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Mardi :    [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Mercredi : [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Jeudi :    [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Vendredi : [  ] Matin   [  ] Après-midi   [  ] Journée entière

4. RÈGLES STATUTAIRES & IMPACTS SUR LA CARRIÈRE
- Rémunération : Traitement indiciaire brut, NBI et régime indemnitaire (IFSE) proratisés. Règle dérogatoire des 6/7e pour la quotité de 80% (rémunéré à 85,71%). Le SFT ne peut être inférieur au montant minimum légal.
- Droits à avancement & retraite : Les périodes de temps partiel sont assimilées à du temps plein pour l'avancement d'échelon et de grade, ainsi que pour la constitution des droits à pension CNRACL.
- Congés annuels : Proratisés au nombre de jours travaillés par semaine (ex: 20 jours ouvrés pour 4 jours/semaine).

5. SIGNATURES & VISAS HIÉRARCHIQUES

Date de la demande : ___ / ___ / 202___
Signature de l'agent(e) :


AVIS MOTIVÉ DU CHEF DE SERVICE / DIRECTEUR :
[  ] Favorable
[  ] Organisation du planning validée
Observations : _________________________________________________________________
Date : ___ / ___ / 202___
Signature et cachet du Chef de service :


DÉCISION DE LA DIRECTION DES RESSOURCES HUMAINES :
[  ] Demande enregistrée et transmise pour établissement de l'arrêté municipal
Date : ___ / ___ / 202___
Pour le Maire de Gennevilliers et par délégation, la Direction des Ressources Humaines :`
  : `VILLE DE GENNEVILLIERS - DIRECTION DES RESSOURCES HUMAINES
FORMULAIRE OFFICIEL : DEMANDE D'EXERCICE DES FONCTIONS À TEMPS PARTIEL SUR AUTORISATION
(Code Général de la Fonction Publique, Art. L. 612-1 & Décret n° 2004-777 du 29 juillet 2004)

1. IDENTIFICATION DE L'AGENT(E)
Nom de naissance : ___________________________   Nom d'usage : ___________________________
Prénom : _____________________________________   Matricule RH : ___________________________
Direction / Pôle : ___________________________   Service : _______________________________
Grade / Emploi : _____________________________   Fonctions exercées : ____________________
Téléphone pro : ______________________________   Courriel : ______________________________

2. OBJET DE LA DEMANDE (CONVENANCES PERSONNELLES)
[  ] Première demande de temps partiel sur autorisation
[  ] Renouvellement d'une période de temps partiel en cours
[  ] Modification de la quotité de travail en cours

3. MODALITÉS & QUOTITÉ DU TEMPS DE TRAVAIL SOLLICITÉ
Quotité demandée (accordée sous réserve des nécessités du service) :
[  ] 50 % d'un temps plein
[  ] 60 % d'un temps plein
[  ] 70 % d'un temps plein
[  ] 80 % d'un temps plein (Rémunéré à 85,7 % soit 6/7e du traitement)
[  ] 90 % d'un temps plein (Rémunéré à 91,4 % soit 32/35e du traitement)

Modalité d'organisation :
[  ] Dans un cadre hebdomadaire
[  ] Dans un cadre mensuel
[  ] Dans un cadre annualisé (rythme scolaire / périscolaire)

Période souhaitée :
Du ___ / ___ / 202___ au ___ / ___ / 202___
(Rappel : La demande doit être déposée au moins 2 mois avant la date d'effet souhaitée).

Répartition hebdomadaire proposée des journées / demi-journées non travaillées :
- Lundi :    [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Mardi :    [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Mercredi : [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Jeudi :    [  ] Matin   [  ] Après-midi   [  ] Journée entière
- Vendredi : [  ] Matin   [  ] Après-midi   [  ] Journée entière

4. SIGNATURES & VISAS HIÉRARCHIQUES

Date de la demande : ___ / ___ / 202___
Signature de l'agent(e) :


AVIS MOTIVÉ DU CHEF DE SERVICE / DIRECTEUR :
[  ] Avis Favorable
[  ] Avis Défavorable (Motif circonstancié lié à la continuité et l'organisation du service requis) :
Observations : _________________________________________________________________
Date : ___ / ___ / 202___
Signature et cachet du Chef de service :


DÉCISION DE LA DIRECTION DES RESSOURCES HUMAINES :
[  ] Autorisation accordée — Arrêté municipal en cours d'établissement
[  ] Rejet motivé après saisine de la CAP le cas échéant
Date : ___ / ___ / 202___
Pour le Maire de Gennevilliers et par délégation, la DRH :`;

  return exportToOfficialDocx({
    title,
    category: "Temps de Travail & Absences CGFP",
    content: title,
    rawText,
    docType: 'circulaire'
  });
}

export interface CourrierAgentDocxOptions {
  title: string;
  agent: {
    civilite: string;
    nom: string;
    prenom: string;
    grade: string;
    direction: string;
    matricule?: string;
    adresse: string;
    codePostal: string;
    ville: string;
    telephone: string;
    email: string;
    destinataireTitre: string;
    destinataireSousCouvert: string;
    destinataireAdresse: string;
  };
  cgfpRef: string;
  modeEnvoi: string;
  bodyText: string;
  piecesJointes?: string[];
  filename?: string;
}

/**
 * Exporte un courrier officiel de l'agent au format .docx avec mise en page administrative française
 */
export async function exportCourrierAgentToDocx(options: CourrierAgentDocxOptions): Promise<void> {
  const { title, agent, cgfpRef, modeEnvoi, bodyText, piecesJointes = [], filename } = options;
  const todayFormatted = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const docParagraphs: Paragraph[] = [];

  // 1. EXPÉDITEUR (Aligné à gauche)
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `${agent.civilite || "Mme"} ${agent.prenom} ${agent.nom}`,
          bold: true,
          size: 22,
          font: "Arial",
          color: "1E293B"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: agent.grade,
          size: 20,
          font: "Arial",
          color: "334155"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: agent.direction + (agent.matricule ? `  •  Matricule : ${agent.matricule}` : ""),
          size: 19,
          font: "Arial",
          color: "475569"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: `${agent.adresse} — ${agent.codePostal} ${agent.ville}`,
          size: 19,
          font: "Arial",
          color: "64748B"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Tél. : ${agent.telephone}  •  Courriel : ${agent.email}`,
          size: 19,
          font: "Arial",
          color: "64748B"
        })
      ]
    })
  );

  // 2. DESTINATAIRE (Aligné à droite)
  const destLines = [
    agent.destinataireTitre,
    ...agent.destinataireSousCouvert.split('\n'),
    ...agent.destinataireAdresse.split('\n')
  ];

  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: destLines[0],
          bold: true,
          size: 21,
          font: "Arial",
          color: "0F172A"
        })
      ]
    })
  );

  for (let i = 1; i < destLines.length; i++) {
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: destLines[i],
            size: 20,
            font: "Arial",
            color: "334155"
          })
        ]
      })
    );
  }

  // 3. DATE ET LIEU
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 240, after: 160 },
      children: [
        new TextRun({
          text: `Fait à Gennevilliers, le ${todayFormatted}`,
          italics: true,
          size: 20,
          font: "Arial",
          color: "334155"
        })
      ]
    })
  );

  // 4. MODE D'ENVOI
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: "Mode d'acheminement : ",
          bold: true,
          size: 20,
          font: "Arial",
          color: "0B3C5D"
        }),
        new TextRun({
          text: modeEnvoi,
          size: 20,
          font: "Arial",
          color: "1E293B"
        })
      ]
    })
  );

  // 5. OBJET & RÉFÉRENCES (Encadré / mis en avant)
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "OBJET : ",
          bold: true,
          size: 21,
          font: "Arial",
          color: "0B3C5D"
        }),
        new TextRun({
          text: title,
          bold: true,
          size: 21,
          font: "Arial",
          color: "0F172A"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 260 },
      border: {
        bottom: {
          color: "CBD5E1",
          space: 8,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [
        new TextRun({
          text: "RÉFÉRENCES JURIDIQUES : ",
          bold: true,
          size: 19,
          font: "Arial",
          color: "475569"
        }),
        new TextRun({
          text: cgfpRef,
          size: 19,
          font: "Arial",
          color: "334155"
        })
      ]
    })
  );

  // 6. CORPS DU COURRIER
  const paragraphs = bodyText.split(/\n\s*\n/);
  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    // Check if bullet point or regular text
    if (trimmed.startsWith('- ') || trimmed.startsWith('1°') || trimmed.startsWith('2°') || trimmed.startsWith('3°')) {
      const lines = trimmed.split('\n');
      for (const line of lines) {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: line.trim(),
                size: 21,
                font: "Arial",
                color: "1E293B"
              })
            ]
          })
        );
      }
    } else {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.BOTH,
          spacing: { after: 140, line: 276 },
          children: [
            new TextRun({
              text: trimmed.replace(/\n/g, ' '),
              size: 21,
              font: "Arial",
              color: "1E293B"
            })
          ]
        })
      );
    }
  }

  // 7. SIGNATURE (Alignée à droite)
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 280, after: 60 },
      children: [
        new TextRun({
          text: `${agent.prenom} ${agent.nom}`,
          bold: true,
          size: 21,
          font: "Arial",
          color: "0F172A"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "(Signature)",
          italics: true,
          size: 18,
          font: "Arial",
          color: "64748B"
        })
      ]
    })
  );

  // 8. PIÈCES JOINTES (En bas de page si présentes)
  if (piecesJointes.length > 0) {
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 60 },
        border: {
          top: {
            color: "E2E8F0",
            space: 6,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        children: [
          new TextRun({
            text: "Pièces jointes fournies :",
            bold: true,
            size: 19,
            font: "Arial",
            color: "334155"
          })
        ]
      })
    );
    for (const pj of piecesJointes) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 40 },
          indent: { left: 300 },
          children: [
            new TextRun({
              text: `• ${pj}`,
              size: 18,
              font: "Arial",
              color: "475569"
            })
          ]
        })
      );
    }
  }

  // CONSTRUCTION DU DOCUMENT
  const doc = new Document({
    title,
    description: `Courrier administratif - ${agent.nom} ${agent.prenom}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${agent.civilite || "Mme"} ${agent.prenom} ${agent.nom}  •  ${title}  •  Page `,
                    size: 16,
                    color: "94A3B8",
                    font: "Arial"
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: "94A3B8",
                    font: "Arial"
                  })
                ]
              })
            ]
          })
        },
        children: docParagraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = (filename || `Courrier_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}`).slice(0, 80);
  saveAs(blob, `${cleanTitle}.docx`);
}


