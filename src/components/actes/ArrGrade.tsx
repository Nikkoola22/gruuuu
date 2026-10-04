import React, { useState } from "react";
import { FileSignature, Copy, CheckCircle2, User, Building, Calendar, Info, Award, ArrowUpRight } from "lucide-react";
import { fptCadres, echelonsList, getIndicesForGradeAndEchelon } from "../../utils/fptData";

export const ArrGrade: React.FC = () => {
  // 1. AUTORITÉ TERRITORIALE & SIGNATURE
  const [numeroArrete, setNumeroArrete] = useState("");
  const [titreAutorite, setTitreAutorite] = useState("Le Maire");
  const [collectivite, setCollectivite] = useState("Commune de Gennevilliers");
  const [departement, setDepartement] = useState("Hauts-de-Seine");
  const [villeSignature, setVilleSignature] = useState("Gennevilliers");
  const [dateArrete, setDateArrete] = useState("");
  const [chargeExecution, setChargeExecution] = useState("La directrice générale des services");

  // 2. AGENT
  const [civilite, setCivilite] = useState("Monsieur");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cadreEmplois, setCadreEmplois] = useState("");

  // 3. STATUT ACTUEL & DÉCRET
  const [numDecret, setNumDecret] = useState("");
  const [dateDecret, setDateDecret] = useState("");
  const [ancienGrade, setAncienGrade] = useState("");
  const [ancienEchelon, setAncienEchelon] = useState("");
  const [ancienIB, setAncienIB] = useState("");
  const [ancienIM, setAncienIM] = useState("");
  const [ancienneteAcquise, setAncienneteAcquise] = useState("1 an 6 mois");

  // 4. AVANCEMENT & NOUVEAU GRADE
  const [nouveauGrade, setNouveauGrade] = useState("");
  const [nouvelEchelon, setNouvelEchelon] = useState("");
  const [nouvelIB, setNouvelIB] = useState("");
  const [nouvelIM, setNouvelIM] = useState("");
  const [conservationAnciennete, setConservationAnciennete] = useState("avec conservation d'une ancienneté de 6 mois");
  const [dateEffet, setDateEffet] = useState("");
  const [dateTableau, setDateTableau] = useState("");
  const [anneeTableau, setAnneeTableau] = useState("2026");
  const [voieAvancement, setVoieAvancement] = useState<"choix" | "examen">("choix");
  const [dateExamenPro, setDateExamenPro] = useState("");

  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCadreChange = (cadreNom: string) => {
    setCadreEmplois(cadreNom);
    const cadre = fptCadres.find(c => c.nom === cadreNom);
    if (cadre) {
      setNumDecret(cadre.decretNum);
      setDateDecret(cadre.decretDate);
      setAncienGrade(cadre.grades[0] || "");
      setNouveauGrade(cadre.grades[1] || cadre.grades[0] || "");
    } else {
      setNumDecret("");
      setDateDecret("");
      setAncienGrade("");
      setNouveauGrade("");
    }
    setAncienEchelon("");
    setNouvelEchelon("");
    setAncienIB("");
    setAncienIM("");
    setNouvelIB("");
    setNouvelIM("");
    setShowResult(false);
  };

  const handleAncienEchelonChange = (ech: string) => {
    setAncienEchelon(ech);
    if (ancienGrade && ech) {
      const idx = getIndicesForGradeAndEchelon(ancienGrade, ech);
      if (idx) {
        setAncienIB(idx.ib);
        setAncienIM(idx.im);
      }
    }
    setShowResult(false);
  };

  const handleNouvelEchelonChange = (ech: string) => {
    setNouvelEchelon(ech);
    if (nouveauGrade && ech) {
      const idx = getIndicesForGradeAndEchelon(nouveauGrade, ech);
      if (idx) {
        setNouvelIB(idx.ib);
        setNouvelIM(idx.im);
      }
    }
    setShowResult(false);
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
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Avancement de grade</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Générateur d'arrêté d'avancement de grade (tableau annuel d'avancement & examen professionnel)
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
                <input type="text" value={numeroArrete} onChange={(e) => setNumeroArrete(e.target.value)} placeholder="Ex: ARR-2026-GRA-012" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
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
              <User className="w-4 h-4 text-slate-400" /> Identité de l'agent
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>

          {/* 3. CADRE D'EMPLOIS & TABLEAU D'AVANCEMENT */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Cadre d'emplois & Tableau d'avancement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cadre d'emplois</label>
                <select value={cadreEmplois} onChange={(e) => handleCadreChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="">— Choisir un cadre d'emplois —</option>
                  {fptCadres.map(c => (
                    <option key={c.id} value={c.nom}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Décret portant statut particulier</label>
                <input type="text" value={numDecret ? `Décret n° ${numDecret} du ${dateDecret}` : ""} readOnly className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Voie de promotion</label>
                <select value={voieAvancement} onChange={(e) => setVoieAvancement(e.target.value as "choix" | "examen")} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="choix">Au choix (ancienneté & LDG)</option>
                  <option value="examen">Après examen professionnel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de l'arrêté du tableau d'avancement</label>
                <input type="date" value={dateTableau} onChange={(e) => setDateTableau(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Année du tableau</label>
                <input type="text" value={anneeTableau} onChange={(e) => setAnneeTableau(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              {voieAvancement === "examen" && (
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de réussite à l'examen professionnel</label>
                  <input type="date" value={dateExamenPro} onChange={(e) => setDateExamenPro(e.target.value)} className="w-full sm:w-1/2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
              )}
            </div>
          </div>

          {/* 4. SITUATION D'ORIGINE & PROMOTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Situation d'origine */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm border-b pb-2">Situation actuelle (origine)</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Grade d'origine</label>
                <select value={ancienGrade} onChange={(e) => setAncienGrade(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="">— Choisir —</option>
                  {selectedCadre?.grades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Échelon</label>
                  <select value={ancienEchelon} onChange={(e) => handleAncienEchelonChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-white">
                    <option value="">—</option>
                    {echelonsList.map(ech => (
                      <option key={ech} value={ech}>{ech}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">IB</label>
                  <input type="text" value={ancienIB} onChange={(e) => setAncienIB(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2 py-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">IM</label>
                  <input type="text" value={ancienIM} onChange={(e) => setAncienIM(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2 py-2 text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Ancienneté acquise dans l'échelon</label>
                <input type="text" value={ancienneteAcquise} onChange={(e) => setAncienneteAcquise(e.target.value)} placeholder="Ex: 1 an 8 mois" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>

            {/* Nouveau grade & Reclassement */}
            <div className="p-5 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-800/50 space-y-3">
              <h4 className="font-bold text-purple-900 dark:text-purple-300 text-sm border-b border-purple-200 dark:border-purple-800 pb-2 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-purple-600" /> Nouveau grade (promu)
              </h4>
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">Nouveau grade</label>
                <select value={nouveauGrade} onChange={(e) => setNouveauGrade(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="">— Choisir —</option>
                  {selectedCadre?.grades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-300 mb-1">Nouvel échelon</label>
                  <select value={nouvelEchelon} onChange={(e) => handleNouvelEchelonChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-white">
                    <option value="">—</option>
                    {echelonsList.map(ech => (
                      <option key={ech} value={ech}>{ech}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-300 mb-1">Nouvel IB</label>
                  <input type="text" value={nouvelIB} onChange={(e) => setNouvelIB(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl px-2 py-2 text-xs font-bold text-purple-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-300 mb-1">Nouvel IM</label>
                  <input type="text" value={nouvelIM} onChange={(e) => setNouvelIM(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl px-2 py-2 text-xs font-bold text-purple-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">Ancienneté d'échelon conservée</label>
                <input type="text" value={conservationAnciennete} onChange={(e) => setConservationAnciennete(e.target.value)} placeholder="Ex: sans ancienneté OU avec conservation de 6 mois" className="w-full bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date d'effet de l'avancement</label>
              <input type="date" value={dateEffet} onChange={(e) => setDateEffet(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tribunal Administratif compétent</label>
              <input type="text" value="Cergy-Pontoise" readOnly className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300" />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
            <p>
              Le reclassement dans le nouveau grade s'opère à indice égal ou immédiatement supérieur avec ou sans conservation d'ancienneté selon les règles du décret statutaire d'application.
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
                Aperçu de l'arrêté d'avancement de grade
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
                ARRÊTÉ PORTANT AVANCEMENT AU GRADE DE<br/>
                {renderField(nouveauGrade.toUpperCase(), "NOUVEAU GRADE")}<br/>
                DE {civilite.toUpperCase()} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}
              </h4>

              <div className="space-y-4 text-justify">
                <p><strong>{renderField(titreAutorite, "LE MAIRE")}</strong> de {renderField(collectivite, "COMMUNE DE GENNEVILLIERS")},</p>
                
                <p><strong>Vu</strong> le code général de la fonction publique (CGFP), notamment ses articles L. 522-23 à L. 522-30 relatifs à l'avancement de grade,</p>
                <p><strong>Vu</strong> l'arrêté municipal du 30 mars 2026 portant délégation d'attribution de fonctions et de signature à Monsieur Pierric ANNOOT, 12ème adjoint au Maire délégué aux Ressources Humaines,</p>
                <p><strong>Vu</strong> le décret n° {renderField(numDecret, "DÉCRET STATUTAIRE")} du {renderField(dateDecret, "DATE DÉCRET")} portant statut particulier du cadre d'emplois des {renderField(cadreEmplois, "CADRE D'EMPLOIS")},</p>
                <p><strong>Vu</strong> les lignes directrices de gestion (LDG) fixant les orientations générales en matière de promotion et de valorisation des parcours professionnels,</p>
                <p><strong>Vu</strong> le tableau annuel d'avancement de grade établi au titre de l'année {anneeTableau || "2026"}, arrêté en date du {renderField(dateTableau, "DATE DU TABLEAU")}, sur lequel est inscrit(e) {civilite} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")},</p>
                {voieAvancement === "examen" && (
                  <p><strong>Vu</strong> l'attestation de réussite à l'examen professionnel d'accès au grade de {renderField(nouveauGrade, "NOUVEAU GRADE")} en date du {renderField(dateExamenPro, "DATE EXAMEN")},</p>
                )}
                <p><strong>Considérant</strong> que l'agent remplit l'ensemble des conditions statutaires exigées pour bénéficier d'un avancement au grade supérieur et qu'un emploi vacant correspondant est ouvert au budget de la collectivité,</p>

                <div className="text-center font-bold mt-8 mb-6">ARRÊTE</div>

                <p><strong>ARTICLE 1 :</strong><br/>
                À compter du {renderField(dateEffet, "DATE D'EFFET")}, {civilite} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}, {renderField(ancienGrade, "GRADE D'ORIGINE")} classé(e) au {renderField(ancienEchelon, "ANCIEN ÉCHELON")} (IB {ancienIB || "—"}, IM {ancienIM || "—"}), est nommé(e) et promu(e) au grade de <strong>{renderField(nouveauGrade, "NOUVEAU GRADE")}</strong>.</p>

                <p><strong>ARTICLE 2 :</strong><br/>
                L'intéressé(e) est classé(e) au <strong>{renderField(nouvelEchelon, "NOUVEL ÉCHELON")}</strong>, Indice Brut {renderField(nouvelIB, "IB")}, Indice Majoré {renderField(nouvelIM, "IM")}, {renderField(conservationAnciennete, "AVEC/SANS CONSERVATION D'ANCIENNETÉ")}.</p>

                <p><strong>ARTICLE 3 :</strong><br/>
                L'agent percevra le traitement indiciaire brut correspondant, augmenté de l'indemnité de résidence, du supplément familial de traitement s'il y a lieu, ainsi que du régime indemnitaire en vigueur (RIFSEEP) afférent au nouveau grade.</p>

                <p><strong>ARTICLE 4 :</strong><br/>
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
