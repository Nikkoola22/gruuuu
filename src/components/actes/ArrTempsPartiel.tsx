import React, { useState } from "react";
import { FileSignature, Copy, CheckCircle2, User, Building, Calendar, Info, Clock, Check } from "lucide-react";
import { fptCadres, echelonsList, getIndicesForGradeAndEchelon } from "../../utils/fptData";

export const ArrTempsPartiel: React.FC = () => {
  // 1. AUTORITÉ TERRITORIALE & SIGNATURE
  const [numeroArrete, setNumeroArrete] = useState("");
  const [titreAutorite, setTitreAutorite] = useState("Le Maire");
  const [collectivite, setCollectivite] = useState("Commune de Gennevilliers");
  const [departement, setDepartement] = useState("Hauts-de-Seine");
  const [villeSignature, setVilleSignature] = useState("Gennevilliers");
  const [dateArrete, setDateArrete] = useState("");

  // 2. AGENT
  const [civilite, setCivilite] = useState("Monsieur");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cadreEmplois, setCadreEmplois] = useState("");
  const [grade, setGrade] = useState("");
  const [echelon, setEchelon] = useState("");
  const [indiceBrut, setIndiceBrut] = useState("");
  const [indiceMajore, setIndiceMajore] = useState("");
  const [posteOccupe, setPosteOccupe] = useState("");

  // 3. MODALITÉS DU TEMPS PARTIEL
  const [typeTempsPartiel, setTypeTempsPartiel] = useState<"autorisation" | "droit">("autorisation");
  const [motifDroit, setMotifDroit] = useState("naissance");
  const [quotite, setQuotite] = useState<"50" | "60" | "70" | "80" | "90">("80");
  const [dateDemande, setDateDemande] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [dureeMois, setDureeMois] = useState("1 an");
  const [organisationService, setOrganisationService] = useState("Service non travaillé le mercredi (soit 28h hebdomadaires réparties sur 4 jours)");
  const [surcotisation, setSurcotisation] = useState(false);

  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCadreChange = (cadreNom: string) => {
    setCadreEmplois(cadreNom);
    const cadre = fptCadres.find(c => c.nom === cadreNom);
    if (cadre) {
      setGrade(cadre.grades[0] || "");
    } else {
      setGrade("");
    }
    setEchelon("");
    setIndiceBrut("");
    setIndiceMajore("");
    setShowResult(false);
  };

  const handleEchelonChange = (ech: string) => {
    setEchelon(ech);
    if (grade && ech) {
      const idx = getIndicesForGradeAndEchelon(grade, ech);
      if (idx) {
        setIndiceBrut(idx.ib);
        setIndiceMajore(idx.im);
      }
    }
    setShowResult(false);
  };

  const getTauxRemuneration = () => {
    switch (quotite) {
      case "50": return "50 % (soit 50/100)";
      case "60": return "60 % (soit 60/100)";
      case "70": return "70 % (soit 70/100)";
      case "80": return "85,7 % (soit 6/7èmes)";
      case "90": return "91,4 % (soit 32/35èmes)";
      default: return `${quotite} %`;
    }
  };

  const handleCopy = () => {
    const el = document.getElementById("arrete-content");
    if (el) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      selection?.removeAllRanges();
    }
  };

  const renderField = (value: string, placeholder: string) => {
    if (!value || value.trim() === "") {
      return <span className="text-orange-500 font-bold bg-orange-50 px-1 rounded">[{placeholder}]</span>;
    }
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    return <span className="font-semibold">{value}</span>;
  };

  const selectedCadre = fptCadres.find(c => c.nom === cadreEmplois);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Travail à temps partiel</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Générateur d'arrêté autorisant le travail à temps partiel (sur autorisation ou de droit - CGFP)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. AUTORITÉ TERRITORIALE */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" /> Autorité territoriale & Signature
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Numéro d'arrêté</label>
                <input type="text" value={numeroArrete} onChange={(e) => setNumeroArrete(e.target.value)} placeholder="Ex: ARR-2026-TP-018" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Collectivité</label>
                <input type="text" value={collectivite} onChange={(e) => setCollectivite(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Département</label>
                <input type="text" value={departement} onChange={(e) => setDepartement(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de l'arrêté</label>
                <input type="date" value={dateArrete} onChange={(e) => setDateArrete(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ville de signature</label>
                <input type="text" value={villeSignature} onChange={(e) => setVilleSignature(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Élu délégataire RH</label>
                <input type="text" value="Monsieur Pierric ANNOOT" readOnly className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300" />
              </div>
            </div>
          </div>

          {/* 2. AGENT */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Agent & Emploi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Civilité</label>
                <select value={civilite} onChange={(e) => setCivilite(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="Monsieur">Monsieur</option>
                  <option value="Madame">Madame</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom de famille</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="DUPONT" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white uppercase" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Prénom</label>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Jean" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cadre d'emplois</label>
                <select value={cadreEmplois} onChange={(e) => handleCadreChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="">— Choisir —</option>
                  {fptCadres.map(c => (
                    <option key={c.id} value={c.nom}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Grade</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} disabled={!cadreEmplois} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="">— Choisir —</option>
                  {selectedCadre?.grades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Échelon</label>
                <select value={echelon} onChange={(e) => handleEchelonChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="">—</option>
                  {echelonsList.map(ech => (
                    <option key={ech} value={ech}>{ech}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">IB / IM</label>
                <input type="text" value={indiceMajore ? `IB ${indiceBrut} - IM ${indiceMajore}` : ""} readOnly className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Emploi / Fonctions exercées</label>
                <input type="text" value={posteOccupe} onChange={(e) => setPosteOccupe(e.target.value)} placeholder="Ex: Gestionnaire paie et carrières" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>

          {/* 3. MODALITÉS DU TEMPS PARTIEL */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Régime, Quotité et Organisation du temps partiel
            </h3>

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name="typeTP" checked={typeTempsPartiel === "autorisation"} onChange={() => setTypeTempsPartiel("autorisation")} className="text-rose-600 focus:ring-rose-500" />
                Temps partiel sur autorisation (nécessités de service)
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name="typeTP" checked={typeTempsPartiel === "droit"} onChange={() => setTypeTempsPartiel("droit")} className="text-rose-600 focus:ring-rose-500" />
                Temps partiel de droit (famille, handicap, soins)
              </label>
            </div>

            {typeTempsPartiel === "droit" && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Motif de droit</label>
                <select value={motifDroit} onChange={(e) => setMotifDroit(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="naissance">À l'occasion de chaque naissance (jusqu'au 3e anniversaire de l'enfant) ou adoption</option>
                  <option value="soins">Pour donner des soins à un conjoint, enfant à charge ou ascendant</option>
                  <option value="handicap">Pour agent relevant de l'obligation d'emploi des travailleurs handicapés (OETH)</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quotité de temps de travail</label>
                <select value={quotite} onChange={(e) => setQuotite(e.target.value as any)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-bold">
                  <option value="50">50 % (payé 50 %)</option>
                  <option value="60">60 % (payé 60 %)</option>
                  <option value="70">70 % (payé 70 %)</option>
                  <option value="80">80 % (payé 85,7 %)</option>
                  {typeTempsPartiel === "autorisation" && <option value="90">90 % (payé 91,4 %)</option>}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date demande de l'agent</label>
                <input type="date" value={dateDemande} onChange={(e) => setDateDemande(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de début</label>
                <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de fin</label>
                <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Organisation hebdomadaire du service</label>
              <input type="text" value={organisationService} onChange={(e) => setOrganisationService(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <input type="checkbox" id="surcotisation" checked={surcotisation} onChange={(e) => setSurcotisation(e.target.checked)} className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4" />
              <label htmlFor="surcotisation" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                Option de <strong>surcotisation pour la retraite (CNRACL)</strong> sur la base du traitement brut à temps plein (dans la limite de 4 trimestres supplémentaires)
              </label>
            </div>

          </div>

          <div className="flex items-start gap-2.5 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
            <p>
              Le travail à temps partiel à <strong>80 %</strong> est rémunéré à <strong>6/7èmes</strong> (soit 85,7 % du plein traitement) et à <strong>90 %</strong> à <strong>32/35èmes</strong> (soit 91,4 %). Les périodes sont comptées comme du temps plein pour les droits à l'avancement d'échelon et de grade (art. L. 612-13 CGFP).
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <button onClick={() => setShowResult(true)} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/30 flex items-center gap-2">
              <FileSignature className="w-5 h-5" />
              Générer l'arrêté (.docx via Copier/Coller)
            </button>
          </div>

        </div>

        {/* APERÇU DE L'ARRÊTÉ */}
        <div className={`mt-8 transition-all duration-500 ${showResult ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 pointer-events-none hidden'}`}>
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Aperçu officiel de l'arrêté de temps partiel
              </h3>
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copié !" : "Copier pour Word"}
              </button>
            </div>
            
            <div className="p-10 font-serif text-[13px] leading-relaxed text-slate-900 dark:text-slate-200 max-h-[650px] overflow-y-auto" id="arrete-content">
              
              <div className="flex justify-between items-start mb-10">
                <div className="w-1/2 text-center border-b border-slate-400 pb-2">
                  <img src="/images/gennevilliers_logo.svg" alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
                  <p className="uppercase font-bold text-sm">{renderField(collectivite, "COMMUNE DE GENNEVILLIERS")}</p>
                  <p className="text-xs">{renderField(departement, "HAUTS-DE-SEINE")}</p>
                </div>
                <div className="w-1/2 text-right">
                  <p>Arrêté n° {renderField(numeroArrete, "NUMÉRO")}</p>
                </div>
              </div>

              <h4 className="text-center font-bold text-lg mb-8 uppercase">
                ARRÊTÉ AUTORISANT L'EXERCICE DES FONCTIONS À TEMPS PARTIEL<br/>
                DE {civilite.toUpperCase()} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}
              </h4>

              <div className="space-y-4 text-justify">
                <p><strong>{renderField(titreAutorite, "LE MAIRE")}</strong> de {renderField(collectivite, "COMMUNE DE GENNEVILLIERS")},</p>
                
                <p><strong>Vu</strong> le code général de la fonction publique (CGFP), notamment ses articles L. 612-1 à L. 612-14 relatifs au travail à temps partiel,</p>
                <p><strong>Vu</strong> l'arrêté municipal du 30 mars 2026 portant délégation d'attribution de fonctions et de signature à Monsieur Pierric ANNOOT, 12ème adjoint au Maire délégué aux Ressources Humaines,</p>
                <p><strong>Vu</strong> le décret n° 2004-777 du 29 juillet 2004 modifié relatif à la mise en œuvre du temps partiel dans la fonction publique territoriale,</p>
                <p><strong>Vu</strong> la demande écrite formulée en date du {renderField(dateDemande, "DATE DEMANDE")} par {civilite} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}, {renderField(grade, "GRADE")}, sollicitant l'autorisation d'exercer ses fonctions à temps partiel à raison de {quotite} % d'un temps plein,</p>
                {typeTempsPartiel === "autorisation" ? (
                  <p><strong>Considérant</strong> que les nécessités du bon fonctionnement du service permettent d'accéder favorablement à cette demande,</p>
                ) : (
                  <p><strong>Considérant</strong> qu'il s'agit d'un temps partiel accordé de plein droit en application des dispositions statutaires applicables,</p>
                )}

                <div className="text-center font-bold mt-8 mb-6">ARRÊTE</div>

                <p><strong>ARTICLE 1 :</strong><br/>
                À compter du {renderField(dateDebut, "DATE DÉBUT")}, et jusqu'au {renderField(dateFin, "DATE FIN")}, {civilite} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}, {renderField(grade, "GRADE")}, est autorisé(e) à accomplir son service à temps partiel à raison de <strong>{quotite} %</strong> de la durée hebdomadaire du travail à temps plein.</p>

                <p><strong>ARTICLE 2 :</strong><br/>
                L'organisation hebdomadaire du service de l'agent est fixée comme suit : {renderField(organisationService, "MODALITÉS D'ORGANISATION DU SERVICE")}.</p>

                <p><strong>ARTICLE 3 :</strong><br/>
                Pendant cette période, l'intéressé(e) percevra <strong>{getTauxRemuneration()}</strong> du traitement de base, de l'indemnité de résidence et des primes et indemnités afférentes à son grade et à son emploi. Le supplément familial de traitement ne peut être inférieur au montant minimum versé aux fonctionnaires à temps plein ayant le même nombre d'enfants à charge.</p>

                <p><strong>ARTICLE 4 :</strong><br/>
                Pour la détermination des droits à l'avancement d'échelon et de grade, les périodes de travail à temps partiel sont assimilées à des périodes de travail à temps plein.
                {surcotisation ? " Par ailleurs, l'agent a sollicité le maintien de sa cotisation retraite sur la base du traitement soumis à retenue pour pension d'un agent à temps plein (surcotisation), conformément aux textes applicables." : ""}
                </p>

                <p><strong>ARTICLE 5 :</strong><br/>
                L'autorisation d'assurer un service à temps partiel est accordée pour la période susmentionnée. Toute demande de renouvellement ou de modification doit être présentée au moins deux mois avant l'expiration de la période en cours.</p>

                <p><strong>ARTICLE 6 :</strong><br/>
                Madame Soraya FONTAINE KESSAR, Directrice Générale des Services, et le Comptable Public sont chargés, chacun en ce qui le concerne, de l'exécution du présent arrêté qui sera notifié à l'intéressé(e).</p>

                <div className="text-[11px] italic mt-8 border-t border-slate-300 pt-4 space-y-2 text-justify">
                  <p>
                    Je soussigné(e) reconnais avoir reçu notification du présent arrêté et avoir été informé(e) que je dois obligatoirement, dans un délai de deux mois à compter de sa notification, et avant de saisir le tribunal administratif, saisir le médiateur du Centre Interdépartemental de Gestion de la Petite Couronne soit par courrier postal à l'adresse suivante : « CIG Petite couronne - Recours à la médiation préalable obligatoire 1 rue Lucienne Gérain 93698 Pantin cedex », soit par message électronique à « mediateur@cig929394.fr » pour qu'il engage une médiation (décret n°2018-101 du 16 février 2018 et arrêté du 2 mars 2018). Une copie de cet arrêté doit être jointe à la demande.
                  </p>
                  <p>
                    Si cette médiation ne permet pas de parvenir à un accord, vous pourrez contester le présent arrêté devant le tribunal administratif de Cergy-Pontoise dans un délai de deux mois à compter de la fin de la médiation. Une copie de cet arrêté devra être jointe à votre recours.
                  </p>
                </div>

                <div className="mt-12 flex justify-between items-end">
                  <div className="w-1/2">
                    <p className="font-bold text-sm mb-12">Signature de l'intéressé(e)<br/><span className="text-xs font-normal italic">(précédée de la mention « lu et approuvé »)</span></p>
                  </div>
                  <div className="text-right w-1/2">
                    <p>Fait à {renderField(villeSignature, "VILLE")}, le {renderField(dateArrete, "DATE DE L'ARRÊTÉ")}</p>
                    <p className="mt-4 font-bold">Pour {renderField(titreAutorite, "LE MAIRE")} et par délégation,</p>
                    <p className="font-bold">Monsieur Pierric ANNOOT</p>
                    <p className="italic text-xs mt-8">(Signature et cachet)</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
