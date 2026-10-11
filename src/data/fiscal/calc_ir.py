#!/usr/bin/env python3
"""Estimation PARTIELLE d'IR : revenus 2025, déclaration 2026, régime ordinaire.

Dérivé du calculateur Paperasse de Romain Simon (MIT). Voir quality/CHANGELOG.md.
Périmètre volontairement explicite : barème, plafonnement général du QF, décote,
forfaits salariaux par déclarant, abattement pensions par pensionné/plafond foyer.
Aucun solde à payer, PFU, prélèvement social, CEHR/CDHR, crédit, réduction, IFI,
quotient exceptionnel ou avantage spécifique n'est calculé dans cette version.
Les paramètres inconnus, revenus non pris en charge et millésimes non vérifiés
sont refusés, au lieu d'être silencieusement ignorés.

  python fiscaliste/scripts/calc_ir.py --rni 45000 --parts 1 --parts-base 1 --json
  python fiscaliste/scripts/calc_ir.py --foyer fiscaliste/foyer.calcul-ir.example.json

--parts-base qualifie l'imposition ordinaire : 1 individuelle, 2 commune.
Il ne se déduit jamais de --parts. Veuvage et situations spéciales hors périmètre.
"""
import argparse
from datetime import date
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import importlib.util
import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parent.parent  # dossier du skill
DATA_DIR = REPO_ROOT / 'data'
DEFAULT_BAREME = DATA_DIR / 'bareme-ir-2025.json'
DEFAULT_PFU = DATA_DIR / 'pfu-prelevements-sociaux.json'  # compatibilité de nom seulement


def load_json(path):
    with Path(path).open(encoding='utf-8') as stream:
        return json.load(stream, parse_constant=lambda x: (_ for _ in ()).throw(ValueError(f'JSON non fini : {x}')))


def number(value, label='montant'):
    if isinstance(value, bool): raise ValueError(f'{label}: nombre attendu, pas booléen.')
    try: result = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError): raise ValueError(f'{label}: nombre invalide.') from None
    if not result.is_finite() or result < 0:
        raise ValueError(f'{label}: nombre fini positif ou nul obligatoire.')
    return result


def euro(value):
    return int(Decimal(str(value)).quantize(Decimal('1'), rounding=ROUND_HALF_UP))


def quality_module():
    candidates = [REPO_ROOT.parent/'quality/rules.py', REPO_ROOT/'quality/rules.py']
    for path in candidates:
        if path.is_file():
            spec = importlib.util.spec_from_file_location('paperasse_ir_rules', path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
    raise ValueError('Contrôle de paramètres absent : installer aussi le dossier quality.')


def validate_bareme(bareme, *, as_of=None):
    if bareme.get('_meta', {}).get('revenus') != 2025 or bareme.get('_meta', {}).get('declaration') != 2026:
        raise ValueError('Seuls les revenus 2025 déclarés en 2026 sont couverts. Pas d’extrapolation.')
    q = quality_module()
    for key, rule in [('abattement_salaires_10pct','ir.salaires'),('abattement_pensions_10pct','ir.pensions')]:
        expected = q.select(rule,2025,as_of=as_of)['value']
        if any(bareme.get(key,{}).get(k) != v for k,v in expected.items()):
            raise ValueError(f'Paramètres contradictoires : {key}.')
    if bareme.get('quotient_familial',{}).get('plafond_gain_par_demi_part') != q.select('ir.qf.general',2025,as_of=as_of)['value']:
        raise ValueError('Plafond général du quotient familial contradictoire.')
    expected = q.select('ir.decote',2025,as_of=as_of)['value']
    if any(bareme.get('decote',{}).get(k) != v for k,v in expected.items() if k!='coefficient'):
        raise ValueError('Paramètres de décote contradictoires.')
    if bareme.get('decote',{}).get('coefficient',.4525) != expected['coefficient']:
        raise ValueError('Coefficient de décote contradictoire.')
    tranches = bareme.get('bareme_ir',{}).get('tranches',[])
    expected = q.select('ir.bareme',2025,as_of=as_of)['value']
    lower = 0
    if len(tranches) != len(expected): raise ValueError('Nombre de tranches incohérent.')
    for i, (tranche,(upper,rate)) in enumerate(zip(tranches,expected)):
        if tranche.get('taux') != rate: raise ValueError('Taux du barème contradictoire.')
        if i==0:
            ok = tranche.get('jusqu_a')==upper
        elif upper is None:
            ok = tranche.get('au_dela')==lower
        else:
            ok = tranche.get('de')==lower and tranche.get('a')==upper
        if not ok: raise ValueError('Bornes du barème contradictoires.')
        lower = upper


def abattement_salaires(brut_1aj, bareme):
    """Montant net après forfait d'UN déclarant, salaire et chômage agrégés."""
    gross = number(brut_1aj,'revenus salariaux')
    cfg = bareme['abattement_salaires_10pct']
    allowance = min(gross, max(number(cfg['minimum']), min(number(cfg['maximum']), gross*number(cfg['taux']))))
    return euro(gross-allowance)


def pensions_foyer(pensions, bareme):
    """Minimum par pensionné ; plafond appliqué une seule fois au foyer."""
    values = [number(p,'pension') for p in pensions]
    cfg = bareme['abattement_pensions_10pct']
    deductions = [min(v,max(number(cfg['minimum']),v*number(cfg['taux']))) if v else Decimal(0) for v in values]
    allowance = min(sum(deductions),number(cfg['maximum']))
    return euro(sum(values)-allowance)


def abattement_pensions(brut_1as, bareme):
    """Compatibilité : un seul pensionné. Plusieurs pensionnés -> pensions_foyer."""
    return pensions_foyer([brut_1as],bareme)


def impot_par_part(quotient, tranches):
    quotient = number(quotient,'quotient')
    total = Decimal(0)
    for tranche in tranches:
        if 'jusqu_a' in tranche:
            low, high = Decimal(0), number(tranche['jusqu_a'])
        elif 'au_dela' in tranche:
            low, high = number(tranche['au_dela']), quotient
        else:
            low, high = number(tranche['de']), number(tranche['a'])
        if quotient <= low: break
        total += (min(quotient,high)-low)*number(tranche['taux'])
    return float(total)


def validate_parts(parts, parts_base):
    parts, base = number(parts,'parts'), number(parts_base,'parts-base')
    if base not in (Decimal(1),Decimal(2)) or parts < base or parts*4 != (parts*4).to_integral_value():
        raise ValueError('Parts invalides : base 1 ou 2 ; total >= base et multiple de 0,25.')
    return parts,base


def decote(impot_brut, parts, bareme):
    tax = number(impot_brut,'impôt brut')
    if parts not in (1,2): raise ValueError('Décote : qualifier explicitement l’imposition individuelle (1) ou commune (2).')
    key = 'celibataire' if parts==1 else 'couple'
    cfg = bareme['decote']
    if tax >= number(cfg['seuil_'+key]): return 0.0
    amount = number(cfg['plafond_'+key])-Decimal('0.4525')*tax
    return float(min(tax,max(Decimal(0),amount)))


def impot_avec_qf(rni, parts_total, parts_base, bareme):
    income = number(rni,'rni'); parts,base = validate_parts(parts_total,parts_base)
    all_tax = Decimal(str(impot_par_part(income/parts,bareme['bareme_ir']['tranches'])))*parts
    base_tax = Decimal(str(impot_par_part(income/base,bareme['bareme_ir']['tranches'])))*base
    real_gain = base_tax-all_tax
    max_gain = (parts-base)*2*number(bareme['quotient_familial']['plafond_gain_par_demi_part'])
    capped = real_gain>max_gain
    return {'impot_brut':euro(base_tax-max_gain if capped else all_tax),
            'impot_total_parts':euro(all_tax),'impot_base_parts':euro(base_tax),
            'gain_qf_reel':euro(real_gain),'gain_qf_max':euro(max_gain),'qf_plafonne':capped}


def cehr(*args, **kwargs):
    raise ValueError('CEHR non calculée ici : RFR retraité, lissage et CDHR nécessitent un module validé distinct.')


def ps_capital(*args, **kwargs):
    raise ValueError('Prélèvements sociaux hors périmètre du calculateur IR sécurisé ; qualifier produit, période et régime séparément.')


def calc(rni, parts, parts_base, bareme, rfr=None, base_ps_patrimoine=0,
         base_ps_placement=0, pfu_data=None, *, as_of=None):
    income = number(rni,'rni'); part,base = validate_parts(parts,parts_base)
    if rfr is not None: number(rfr,'rfr')
    if number(base_ps_patrimoine) or number(base_ps_placement):
        raise ValueError('Calcul de prélèvements sociaux hors périmètre ; aucun total global ne peut être fourni.')
    validate_bareme(bareme,as_of=as_of)
    qf = impot_avec_qf(income,part,base,bareme)
    deduction = euro(decote(qf['impot_brut'],base,bareme))
    net = max(0,qf['impot_brut']-deduction)
    return {
        'statut':'estimation_partielle','annee_revenus':2025,'annee_declaration':2026,
        'date_controle':str(as_of or date.today()),'rni':float(income),'parts':float(part),'parts_base':float(base),
        'quotient_par_part':euro(income/part),'impot_brut_apres_qf':qf['impot_brut'],
        'qf_details':{'gain_qf_reel':qf['gain_qf_reel'],'gain_qf_max':qf['gain_qf_max'],'plafonne':qf['qf_plafonne']},
        'decote':deduction,'impot_apres_decote':net,'sous_total_calcule':net,
        'total_a_payer':None,'prelevements_sociaux':None,'ps_details':None,'cehr':None,
        'non_calcules':['réductions et crédits','prélèvement à la source et acomptes','PFU et prélèvements sociaux','CEHR/CDHR','IFI','abattements spécifiques âge/invalidité','régimes particuliers du quotient familial'],
        '_note':'Sous-total technique au barème. Ce résultat n’est ni un avis d’impôt ni un solde à payer. Les déductions du RNI et la situation fiscale doivent être validées en amont.'
    }


def from_foyer(foyer, bareme, pfu_data=None, *, as_of=None):
    if not isinstance(foyer,dict): raise ValueError('Objet foyer attendu.')
    allowed_sections = {'_meta','foyer','revenus','deductions','options_fiscales','patrimoine_ifi','equity_salarial','niches_fiscales'}
    if any(k not in allowed_sections and not k.startswith('_') for k in foyer):
        raise ValueError('Section foyer inconnue : ne pas ignorer des données.')
    meta=foyer.get('_meta',{})
    if meta.get('annee_revenus')!=2025 or meta.get('annee_declaration')!=2026:
        raise ValueError('Années revenus 2025 / déclaration 2026 obligatoires.')
    f,r,d=foyer.get('foyer',{}),foyer.get('revenus',{}),foyer.get('deductions',{})
    if not all(isinstance(v,dict) for v in (f,r,d)): raise ValueError('Sections foyer, revenus, deductions invalides.')
    situation=f.get('situation')
    if situation not in ('celibataire','marie','pacse','divorce'):
        raise ValueError('Situation non prise en charge (notamment veuvage). Fournir un RNI et des parts validés pour une estimation générale séparée.')
    base=2 if situation in ('marie','pacse') else 1
    departement = str(f.get('departement_residence','')).strip().upper()
    metropole = {f'{n:02d}' for n in range(1,96) if n != 20} | {'2A','2B'}
    if f.get('residence_fiscale')!='FR' or departement not in metropole:
        raise ValueError('Résidence fiscale étrangère, DOM/COM ou département non reconnu : hors périmètre.')
    if not f.get('departement_residence'): raise ValueError('Département nécessaire pour vérifier le périmètre territorial.')
    supported_foyer={'situation','residence_fiscale','departement_residence','nb_enfants_charge','nb_enfants_alternee','nb_enfants_invalides','annee_naissance_declarant1','annee_naissance_declarant2'}
    if any(k not in supported_foyer and not k.startswith('_') and v not in (0,False,None,'') for k,v in f.items()):
        raise ValueError('Particularité du foyer non prise en charge.')
    for key in ('nb_enfants_charge','nb_enfants_alternee','nb_enfants_invalides'):
        if type(f.get(key,0)) is not int or f.get(key,0)<0: raise ValueError(f'{key}: entier positif ou nul attendu.')
    if f.get('nb_enfants_alternee',0) or f.get('nb_enfants_invalides',0):
        raise ValueError('Garde alternée / invalidité : quotient familial spécifique non calculé.')
    children=f.get('nb_enfants_charge',0)
    if base==1 and children:
        raise ValueError('Parent avec enfants : qualifier le régime spécifique avant tout calcul de plafonnement.')
    allowed={'salaires_declarant1','salaires_declarant2','pensions_declarant1','pensions_declarant2','chomage_declarant1','chomage_declarant2','revenus_chomage'}
    for key,value in r.items():
        if key.startswith('_'): continue
        amount=number(value,key)
        if key not in allowed and amount:
            raise ValueError(f'Revenu non calculé : {key}. Ne pas supprimer ce revenu pour obtenir un résultat.')
    if base==1 and any(number(r.get(k,0),k) for k in ('salaires_declarant2','pensions_declarant2','chomage_declarant2')):
        raise ValueError('Revenus déclarant 2 incompatibles avec une imposition individuelle.')
    legacy=number(r.get('revenus_chomage',0),'revenus_chomage')
    if legacy and (base==2 or r.get('chomage_declarant1',0) or r.get('chomage_declarant2',0)):
        raise ValueError('Répartir le chômage par déclarant, sans doublonner revenus_chomage.')
    if any(number(v,k) for k,v in d.items() if not k.startswith('_')):
        raise ValueError('Déductions non validées : plafond personnel PER, pensions ou CSG à vérifier. Utiliser un RNI validé, ne pas effacer les déductions du dossier.')
    for section in ('equity_salarial','niches_fiscales'):
        if any(v not in (0,False,None,'') for k,v in foyer.get(section,{}).items() if not k.startswith('_')):
            raise ValueError(f'{section}: non calculé, contrôle distinct requis.')
    if foyer.get('patrimoine_ifi',{}).get('assujetti') or foyer.get('patrimoine_ifi',{}).get('valeur_nette_taxable',0):
        raise ValueError('IFI : calcul distinct requis.')
    if foyer.get('options_fiscales',{}).get('revenus_capital','pfu') not in ('pfu',None):
        raise ValueError('Option barème des revenus du capital : hors périmètre.')
    salaries=sum(abattement_salaires(number(r.get(f'salaires_declarant{i}',0))+number(r.get(f'chomage_declarant{i}',0))+(legacy if i==1 else 0),bareme) for i in (1,2))
    pensions=pensions_foyer([r.get('pensions_declarant1',0),r.get('pensions_declarant2',0)],bareme)
    parts=base+.5*min(children,2)+max(0,children-2)
    return calc(salaries+pensions,parts,base,bareme,as_of=as_of)


def main(argv=None):
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--rni',type=float)
    p.add_argument('--parts',type=float)
    p.add_argument('--parts-base',type=float,help='1 imposition individuelle ordinaire ; 2 commune. Obligatoire avec --rni.')
    p.add_argument('--rfr',type=float,help='Accepté comme information, CEHR non calculée.')
    p.add_argument('--base-ps',type=float,default=0,help='Ancien paramètre ; montant non nul refusé.')
    p.add_argument('--base-ps-patrimoine',type=float,default=0)
    p.add_argument('--base-ps-placement',type=float,default=0)
    p.add_argument('--foyer')
    p.add_argument('--bareme',default=str(DEFAULT_BAREME))
    p.add_argument('--pfu',help='Ancien paramètre, non utilisé ; calcul du capital hors périmètre.')
    p.add_argument('--json',action='store_true')
    args=p.parse_args(argv)
    try:
        if args.foyer and any(x is not None for x in (args.rni,args.parts,args.parts_base,args.rfr)):
            p.error('Choisir --foyer OU le calcul direct, pas les deux.')
        if args.pfu or args.base_ps or args.base_ps_patrimoine or args.base_ps_placement:
            p.error('Capital et prélèvements sociaux hors périmètre ; aucune approximation silencieuse.')
        bareme=load_json(args.bareme)
        if args.foyer: result=from_foyer(load_json(args.foyer),bareme)
        else:
            if args.rni is None or args.parts is None or args.parts_base is None:
                p.error('--rni, --parts et --parts-base obligatoires sauf avec --foyer.')
            result=calc(args.rni,args.parts,args.parts_base,bareme,rfr=args.rfr)
        if args.json: print(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False))
        else:
            print('ESTIMATION PARTIELLE — revenus 2025 / déclaration 2026')
            print(f"RNI : {result['rni']:,.2f} EUR ; parts : {result['parts']}")
            print(f"Impôt brut après plafonnement QF : {result['impot_brut_apres_qf']} EUR")
            print(f"Décote : {result['decote']} EUR")
            print(f"SOUS-TOTAL AU BARÈME : {result['sous_total_calcule']} EUR")
            print(result['_note'])
            print('Non calculés : '+', '.join(result['non_calcules']))
        return 0
    except (ValueError,OSError,KeyError,TypeError) as exc:
        print(f'CALCUL BLOQUÉ : {exc}',file=sys.stderr);return 2

if __name__=='__main__': sys.exit(main())
