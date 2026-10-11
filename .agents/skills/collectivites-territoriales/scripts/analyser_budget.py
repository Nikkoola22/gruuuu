#!/usr/bin/env python3
"""Indicateurs M57 limités, sur agrégats qualifiés. Aucune décision juridique."""
import argparse
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / 'quality/registry.json'
RULES = ROOT / 'quality/rules.py'
if not RULES.exists():  # Arborescence du kit avant matérialisation de l'overlay.
    RULES = ROOT.parent / 'quality/rules.py'
spec = importlib.util.spec_from_file_location('public_budget_rules', RULES)
rules = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rules)
AMOUNTS = ('recettes_reelles_fonctionnement', 'depenses_reelles_fonctionnement',
           'remboursement_capital_dette', 'encours_dette_fin_exercice')
CONTRACT = {'instruction': 'M57', 'nature': 'administratif', 'devise': 'EUR',
            'formules': 'rrf-drf;eb-capital;eb/rrf*100;dette/eb'}


def analyse(data, *, as_of=None, registry=None):
    today = as_of or date.today()
    if not isinstance(data, dict) or type(data.get('schema_version')) is not int or data['schema_version'] != 1:
        raise ValueError('Schéma de dossier invalide.')
    for name in ('collectivite', 'budget', 'donnees', 'provenance'):
        if not isinstance(data.get(name), dict): raise ValueError(f'{name} : objet obligatoire.')
    entity, budget, amounts, provenance = (data[n] for n in ('collectivite', 'budget', 'donnees', 'provenance'))
    if entity.get('type') not in ('commune', 'epci', 'departement', 'region', 'etablissement_public_local'):
        raise ValueError('Entité hors périmètre : qualifier le régime public/privé ou mixte.')
    for obj, keys in ((entity, ('nom',)), (budget, ('nom',)),
                      (provenance, ('document', 'page_ou_tableau', 'note_retraitements'))):
        for key in keys:
            if not isinstance(obj.get(key), str) or not obj[key].strip():
                raise ValueError(f'{key} : précision ou provenance manquante.')
    if budget.get('instruction') != 'M57' or budget.get('nature') != 'administratif':
        raise ValueError('Seul un budget administratif M57 est couvert par ce script ; qualifier M4 séparément.')
    if budget.get('periode') != 'annuelle' or budget.get('base') not in ('prevision', 'execution'):
        raise ValueError('Une base annuelle homogène, prévision ou exécution, est obligatoire.')
    if provenance.get('agregats_retraites') is not True:
        raise ValueError('Les agrégats doivent être qualifiés et les retraitements documentés.')
    reg = rules.load_registry(REGISTRY) if registry is None else registry
    rule = rules.select('collectivites.indicateurs', budget.get('exercice'), as_of=today, registry=reg)
    if rule['value'] != CONTRACT: raise ValueError('Contrat de calcul et registre incompatibles.')
    if budget['base'] == 'execution' and budget['exercice'] >= today.year:
        raise ValueError('Un exercice non terminé ne peut pas être présenté comme une exécution annuelle complète.')
    if set(amounts) != set(AMOUNTS):
        raise ValueError('Les quatre agrégats attendus sont obligatoires ; données supplémentaires non interprétées.')
    values = {name: rules.nonnegative(amounts[name], name) for name in AMOUNTS}
    if any(n > Decimal('1e15') for n in values.values()):
        raise ValueError('Limite technique dépassée : contrôler les unités des montants en euros.')
    if any(n != n.quantize(Decimal('0.01')) for n in values.values()):
        raise ValueError('Les montants en euros doivent être exprimés au centime, sans fraction de centime.')
    rrf, drf, capital, debt = (values[n] for n in AMOUNTS)
    gross = rrf - drf; net = gross - capital
    def rounded(n): return format(n.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), 'f')
    points = ['Rapprocher les agrégats avec les pièces ; leurs retraitements ne sont pas vérifiés automatiquement.',
              'Ne pas déduire un équilibre réel ou une conformité globale de ces indicateurs.']
    if gross <= 0: points.append('Épargne brute nulle ou négative : capacité de désendettement non calculable.')
    if not rrf: points.append('Recettes nulles : taux d’épargne brute non calculable.')
    return {'statut': 'indicateurs_previsionnels' if budget['base'] == 'prevision' else 'indicateurs_execution',
            'collectivite': entity['nom'], 'budget': dict(budget), 'date_controle': str(today),
            'provenance': dict(provenance), 'devise': 'EUR',
            'indicateurs': {'epargne_brute_eur': rounded(gross), 'epargne_nette_eur': rounded(net),
                           'taux_epargne_brute_pct': rounded(gross / rrf * 100) if rrf else None,
                           'capacite_desendettement_ans': rounded(debt / gross) if gross > 0 else None},
            'formules': CONTRACT['formules'], 'sources': [reg['sources'][s]['url'] for s in rule['sources']],
            'points_a_verifier': points, 'equilibre_reel': None, 'certification': False}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, help='JSON conforme au schéma documenté ; aucun envoi réseau.')
    args = parser.parse_args(argv)
    try:
        data = json.loads(Path(args.input).read_text(encoding='utf-8'))
        print(json.dumps(analyse(data), ensure_ascii=False, indent=2, allow_nan=False))
        return 0
    except (ValueError, OSError) as exc:
        print(f'ANALYSE BLOQUÉE : {exc}', file=sys.stderr)
        return 2


if __name__ == '__main__': sys.exit(main())
