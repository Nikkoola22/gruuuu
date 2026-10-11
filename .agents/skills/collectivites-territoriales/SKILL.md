---
name: collectivites-territoriales
description: >-
  Préparer les audits internes, dossiers budgétaires et administratifs des communes,
  EPCI, départements, régions et établissements publics locaux français. Utiliser
  pour M57, CFU, contrôle interne, commande publique, RH territoriales, RSU et
  projets de délibération. Qualifier les budgets M4 et les organismes mixtes.
  Ne s'applique pas à l'impôt personnel d'un agent ni aux comptes d'une société privée.
metadata:
  version: "2026-09-14.2"
  review_scope: "Préparation documentaire et indicateurs limités ; pas de certification"
---

# Collectivités territoriales

Accompagner les services, élus et agents dans la préparation d'un dossier public
local, d'une revue interne ou d'un plan d'action. Lire
[quality/POLICY.md](quality/POLICY.md), puis seulement les références utiles.

## Qualifier avant de transposer

Identifier l'entité et sa compétence, le budget principal ou annexe, l'exercice,
le référentiel appliqué, le rôle du demandeur et la nature du livrable.
Pour une question générale, ne pas demander un dossier complet.

- Communes, EPCI, départements, régions et établissements publics locaux :
  parcours public, avec distinction des budgets administratifs et SPIC/EPIC.
- M57/M4, CCAS/CIAS, régies et statuts particuliers : demander le régime effectif.
  Un EPCI n'est pas une collectivité territoriale au sens juridique strict.
- SEM, SPL, associations subventionnées et partenaires : qualifier la personne
  morale et l'objet du contrôle. Le financement public ne suffit pas à appliquer
  M57 ; une société peut aussi être soumise à des obligations d'achat spécifiques.
- Impôt personnel d'un agent : `fiscaliste`. Comptes d'une entreprise privée :
  modules privés si installés. Ne pas conclure sur son employeur à partir du statut de l'agent.

## Choisir le travail utile

| Demande | Référence à ouvrir | Livrable possible |
|---|---|---|
| Budget, CFU, inventaire, dette, M57/M4 | [Budget et comptabilité](references/budget-comptabilite.md) | Note financière, liste des rapprochements et pièces manquantes |
| Audit interne, cartographie des risques, suites d'observations CRC | [Audit et contrôle interne](references/audit-controle-interne.md) | Rapport préparatoire, constats documentés, plan d'action |
| Préparation ou revue d'un achat | [Commande publique](references/commande-publique.md) | Dossier de vérification du besoin à l'exécution |
| Organisation RH, effectifs, RSU, LDG, procédures FPT | [Ressources humaines](references/ressources-humaines.md) | Revue documentaire et questions à la DRH/CDG |
| Délibération, décision, subvention, transmission, données | [Actes et données](references/actes-donnees.md) | Projet de note ou de délibération et circuit de validation |

## Conduire une revue

1. Définir la question, la période et les pièces nécessaires à l'aide de la
   [checklist de pièces](templates/pieces-a-reunir.md). Distinguer données votées,
   prévisions, exécution provisoire et comptes arrêtés.
2. Examiner les sources du [registre public](quality/registry.json), leur date et
   leur périmètre. Lire la version du texte applicable au dossier. La vérification
   locale du registre ne consulte pas les sites et n'atteste pas l'actualité du droit.
3. Relier chaque observation à une pièce, une règle ou un contrôle interne attendu.
   L'absence de pièce est un point non vérifié, pas une irrégularité démontrée.
4. Pour un indicateur couvert, exécuter le script ci-dessous sur des agrégats
   qualifiés. Pour le reste, expliquer la méthode et les vérifications requises.
5. Restituer la portée, les observations et les suites dans le
   [rapport](templates/rapport-audit.md) ou la
   [note de décision](templates/note-decision.md). Distinguer priorité de suivi,
   gravité d'un risque et infraction juridiquement établie.

## Démonstration financière locale

Depuis le dossier du skill installé :

```bash
python3 quality/rules.py --check
python3 scripts/analyser_budget.py --input collectivite.example.json
```

Le fichier est entièrement fictif. Le script calcule quelques indicateurs sur un
budget administratif M57 annuel 2026, sous réserve du registre valide. Les montants
doivent déjà être rapprochés et retraités : il ne convertit ni une balance ni un CFU.
Il distingue prévision et exécution, conserve les épargnes négatives et ne calcule
pas de désendettement avec une épargne brute nulle ou négative. Voir le
[schéma des données](references/donnees-budget.md).

## Limites d'autorité

Une revue préparatoire n'est ni un contrôle préfectoral, ni une observation CRC,
ni une certification de comptes. Ne pas appliquer les seuils CAC des sociétés
aux collectivités, ni une déclaration IS/FEC privée à un budget M57.
Ne pas annoncer un budget légalement équilibré à partir des seuls indicateurs.
Les décisions RH, l'engagement d'une dépense, la signature, la transmission et
la publication relèvent de l'autorité compétente et de l'autorisation de l'utilisateur.

Des [scénarios de vérification](evals/scenarios.json) sont fournis pour tester le
comportement de l'assistant dans l'hôte choisi. Leur présence ne vaut pas exécution.
