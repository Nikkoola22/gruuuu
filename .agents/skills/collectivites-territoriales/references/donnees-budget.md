# Données attendues par le calculateur

Utiliser `collectivite.example.json` comme structure. Toutes les sommes sont en
euros, au centime sans fraction de centime ; les quatre champs de `donnees` sont obligatoires. Un montant absent n'est
pas égal à zéro et une ligne supplémentaire n'est pas intégrée implicitement.

| Champ | Signification |
|---|---|
| `collectivite.type` | commune, epci, departement, region ou etablissement_public_local ; les cas mixtes sont refusés |
| `budget` | Nom, nature administratif, instruction M57, exercice 2026, période annuelle, base prevision ou execution |
| `recettes_reelles_fonctionnement` | Agrégat annuel qualifié, avec retraitements documentés |
| `depenses_reelles_fonctionnement` | Même périmètre, comprenant les intérêts de la dette |
| `remboursement_capital_dette` | Capital remboursé sur l'année, hors gestion active/refinancement retraité |
| `encours_dette_fin_exercice` | Encours en fin d'exercice, constaté ou projeté selon la base retenue |
| `provenance` | Document, page/tableau, confirmation du retraitement et explication des opérations exclues |

Retraiter les opérations d'ordre, cessions et opérations de gestion active de
la dette selon les agrégats retenus ; ne pas mélanger budgets ou méthodes entre
montants. Le script demande une confirmation et une trace : il ne les prouve pas.
Une consolidation nécessite un traitement des flux réciproques hors de cet outil.

## Formules et lecture

- Épargne brute = recettes réelles de fonctionnement − dépenses réelles de fonctionnement.
- Épargne nette = épargne brute − remboursement du capital.
- Taux d'épargne brute = épargne brute / recettes réelles de fonctionnement × 100.
- Capacité de désendettement = encours de dette / épargne brute, exprimée en années.

Le rapport CRC cité expose les notions d'épargne et de capacité de désendettement :
[annexe du rapport sur Paris](https://www.ccomptes.fr/sites/default/files/2025-10/IDR2025-42.pdf).
Seules les définitions sont utilisées ; ses montants, comparaisons et appréciations
ne sont pas généralisés. Aucun seuil de risque n'est fixé par le module.

Le résultat restitue des chaînes décimales à deux chiffres après la virgule,
arrondies au centime/centième. Les valeurs négatives d'épargne sont conservées.
Avec une épargne brute non positive, le désendettement vaut `null` et une explication
est fournie. Avec des recettes nulles, le taux vaut `null`.

La démonstration 2026 est prévisionnelle. Une exécution annuelle de l'exercice
en cours est refusée. Le millésime suivant et l'usage après l'échéance du registre
nécessitent une revue réelle et une évolution documentée de ce périmètre.
Les montants supérieurs à 10^15 euros sont refusés comme limite technique de saisie.
