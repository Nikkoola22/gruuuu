import React, { useState } from "react";
import { FileText, Plus, Trash2, Copy, CheckCircle2, Building2, User, Users, Calendar, Gavel, Scale, Info } from "lucide-react";
import { CADRES_EMPLOIS } from "../../data/gradesData";

export const DelibPoste: React.FC = () => {
  // 1. COLLECTIVITÉ & SÉANCE
  const [collectivite, setCollectivite] = useState("Commune de Gennevilliers");
  const [departement, setDepartement] = useState("Hauts-de-Seine");
  const [organe, setOrgane] = useState("Le Conseil Municipal");
  const [numeroDelib, setNumeroDelib] = useState("");
  const [dateSeance, setDateSeance] = useState("");
  const [heureSeance, setHeureSeance] = useState("19:00");
  const [president, setPresident] = useState("Monsieur Patrice LECLERC, Maire");
  const [secretaire, setSecretaire] = useState("");
  const [dateAffichage] = useState("");
  const [dateTransmPrefecture] = useState("");

  // Structures hiérarchiques
  const [structures, setStructures] = useState<string[]>([
    "Direction Générale des Services",
    "Direction des Ressources Humaines"
  ]);

  const addStructure = () => setStructures([...structures, ""]);
  const updateStructure = (index: number, value: string) => {
    const newStructures = [...structures];
    newStructures[index] = value;
    setStructures(newStructures);
  };
  const removeStructure = (index: number) => {
    setStructures(structures.filter((_, i) => i !== index));
  };

  // 2. IDENTIFICATION DU POSTE
  const [actionType, setActionType] = useState<"creation" | "suppression">("creation");
  const [numPoste, setNumPoste] = useState("");
  const [quotite, setQuotite] = useState(100);
  const [heuresHebdo, setHeuresHebdo] = useState("35h00");
  const [libelle, setLibelle] = useState("");
  const [dateEffet, setDateEffet] = useState("");
  const [motifAction, setMotifAction] = useState("Renforcement des effectifs pour faire face au développement des projets municipaux");
  const [ouvertContractuel, setOuvertContractuel] = useState(true);
  
  const [cadreId, setCadreId] = useState("");
  const [gradeId, setGradeId] = useState("");

  const selectedCadre = CADRES_EMPLOIS.find(c => c.id === cadreId);
  const selectedGrade = selectedCadre?.grades.find(g => g.id === gradeId);

  // 3. QUORUM & VOTE
  const [membres, setMembres] = useState("43");
  const [presents, setPresents] = useState("38");
  const [representes, setRepresentes] = useState("4");
  const [pour, setPour] = useState("42");
  const [contre, setContre] = useState("0");
  const [abstentions, setAbstentions] = useState("0");

  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCopy = () => {
    const el = document.getElementById("delib-content");
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Délibération de création / suppression d'emploi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Générez la délibération du Conseil Municipal conforme aux articles L. 313-1 et L. 332-8 du Code général de la fonction publique (CGFP) et au CGCT.
            </p>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
          <span><strong>Base légale :</strong> Art. L. 313-1 et L. 332-8 CGFP • Art. L. 2121-29 CGCT</span>
          <span className="text-rose-500 font-medium">* Champs recommandés</span>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 1. COLLECTIVITÉ & SÉANCE */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">1</span>
            COLLECTIVITÉ & SÉANCE
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nom de la collectivité</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input type="text" value={collectivite} onChange={(e) => setCollectivite(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 px-4 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Département</label>
              <input type="text" value={departement} onChange={(e) => setDepartement(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Organe délibérant</label>
              <div className="relative">
                <Gavel className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input type="text" value={organe} onChange={(e) => setOrgane(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 px-4 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">N° de délibération</label>
              <input type="text" value={numeroDelib} onChange={(e) => setNumeroDelib(e.target.value)} placeholder="Ex: DEL-2026-042" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de la séance</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input type="date" value={dateSeance} onChange={(e) => setDateSeance(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 px-4 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Heure de la séance</label>
              <input type="time" value={heureSeance} onChange={(e) => setHeureSeance(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Président(e) de séance</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input type="text" value={president} onChange={(e) => setPresident(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 px-4 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Secrétaire de séance</label>
              <input type="text" value={secretaire} onChange={(e) => setSecretaire(e.target.value)} placeholder="Nom du secrétaire élu" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* 2. DIRECTION / SERVICE */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">2</span>
            AFFECTATION & STRUCTURE
          </h4>
          <div className="space-y-3">
            {structures.map((struct, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Niveau {index + 1}</label>
                  <input type="text" value={struct} onChange={(e) => updateStructure(index, e.target.value)} placeholder="Ex: Direction Générale des Services" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                {index > 0 && (
                  <button onClick={() => removeStructure(index)} className="self-end mb-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addStructure} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Ajouter un niveau hiérarchique
            </button>
          </div>
        </div>

        {/* 3. CARACTÉRISTIQUES DE L'EMPLOI */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">3</span>
            CARACTÉRISTIQUES DE L'EMPLOI
          </h4>
          
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="radio" name="actionType" checked={actionType === "creation"} onChange={() => setActionType("creation")} className="text-rose-600 focus:ring-rose-500" />
              Création d'emploi
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="radio" name="actionType" checked={actionType === "suppression"} onChange={() => setActionType("suppression")} className="text-rose-600 focus:ring-rose-500" />
              Suppression d'emploi (après vacance)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Intitulé du poste / Emploi</label>
              <input type="text" value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Ex: Chargé(e) de mission Gestion Prévisionnelle des RH" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Numéro de poste au tableau des effectifs</label>
              <input type="text" value={numPoste} onChange={(e) => setNumPoste(e.target.value)} placeholder="Ex: P-0428" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quotité de travail</label>
              <div className="flex gap-2">
                <input type="number" min="10" max="100" value={quotite} onChange={(e) => setQuotite(Number(e.target.value))} className="w-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white text-center font-bold" />
                <span className="self-center text-sm font-semibold">%</span>
                <input type="text" value={heuresHebdo} onChange={(e) => setHeuresHebdo(e.target.value)} placeholder="Ex: 35h00 ou 17h30" className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date d'effet</label>
              <input type="date" value={dateEffet} onChange={(e) => setDateEffet(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cadre d'emplois de référence</label>
              <select value={cadreId} onChange={(e) => { setCadreId(e.target.value); setGradeId(""); }} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white">
                <option value="">— sélectionner un cadre d'emplois —</option>
                {CADRES_EMPLOIS.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} ({c.categorie})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Grade correspondant</label>
              <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} disabled={!cadreId} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white disabled:opacity-50">
                <option value="">{cadreId ? "— tous les grades du cadre / ou grade ciblé —" : "— choisir d'abord un cadre —"}</option>
                {selectedCadre?.grades.map(g => (
                  <option key={g.id} value={g.id}>{g.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Motif / Justification du besoin</label>
            <textarea value={motifAction} onChange={(e) => setMotifAction(e.target.value)} rows={2} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
          </div>

          {actionType === "creation" && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-3">
              <input type="checkbox" id="contractuel" checked={ouvertContractuel} onChange={(e) => setOuvertContractuel(e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4" />
              <label htmlFor="contractuel" className="text-xs text-purple-900 dark:text-purple-300 cursor-pointer">
                Prévoir la clause de recrutement contractuel en cas de recherche infructueuse de candidats fonctionnaires (art. L. 332-8 CGFP)
              </label>
            </div>
          )}
        </div>

        {/* 4. QUORUM & VOTE */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">4</span>
            QUORUM & RÉSULTAT DU VOTE
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Membres en exercice</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="number" min="0" value={membres} onChange={(e) => setMembres(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-2 py-2 text-sm text-center font-semibold text-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Présents</label>
              <input type="number" min="0" value={presents} onChange={(e) => setPresents(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2 py-2 text-sm text-center font-semibold text-slate-900 dark:text-white" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Représentés</label>
              <input type="number" min="0" value={representes} onChange={(e) => setRepresentes(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2 py-2 text-sm text-center font-semibold text-slate-900 dark:text-white" />
            </div>
            
            <div className="col-span-2 mt-2">
              <label className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">Pour</label>
              <input type="number" min="0" value={pour} onChange={(e) => setPour(e.target.value)} className="w-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-2 py-2 text-sm text-center font-bold text-emerald-700 dark:text-emerald-400" />
            </div>
            <div className="col-span-2 mt-2">
              <label className="block text-[10px] uppercase font-bold text-red-600 dark:text-red-400 mb-1">Contre</label>
              <input type="number" min="0" value={contre} onChange={(e) => setContre(e.target.value)} className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-2 py-2 text-sm text-center font-bold text-red-700 dark:text-red-400" />
            </div>
            <div className="col-span-2 mt-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Abstention(s)</label>
              <input type="number" min="0" value={abstentions} onChange={(e) => setAbstentions(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-sm text-center font-bold text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
          <p>
            Les champs non renseignés apparaîtront en <strong>orange</strong> dans l'acte généré. Cliquez sur « Générer la délibération » pour obtenir l'aperçu et le texte prêt pour Word.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => setShowResult(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/30 flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Générer la délibération (.docx via Copier/Coller)
          </button>
        </div>

      </div>

      {/* APERÇU DE LA DÉLIBÉRATION */}
      <div className={`mt-8 transition-all duration-500 ${showResult ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 pointer-events-none hidden'}`}>
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Aperçu officiel de la délibération
            </h3>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié !" : "Copier pour Word"}
            </button>
          </div>
          
          <div className="p-10 font-serif text-[13px] leading-relaxed text-slate-900 dark:text-slate-200 max-h-[700px] overflow-y-auto" id="delib-content">
            
            <div className="flex justify-between items-start mb-8">
              <div className="w-1/2 text-center border-b border-slate-400 pb-2">
                <img src="/images/gennevilliers_logo.svg" alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
                <p className="uppercase font-bold text-sm">{renderField(collectivite, "COMMUNE DE GENNEVILLIERS")}</p>
                <p className="text-xs">{renderField(departement, "HAUTS-DE-SEINE")}</p>
                <p className="text-xs italic mt-1">{renderField(organe, "CONSEIL MUNICIPAL")}</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="font-bold">Délibération n° {renderField(numeroDelib, "NUMÉRO")}</p>
                <p className="text-xs mt-1">Séance du {renderField(dateSeance, "DATE")}</p>
                <p className="text-xs">Ouverture : {renderField(heureSeance, "HEURE")}</p>
              </div>
            </div>

            <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p><strong>Présidence :</strong> {renderField(president, "PRÉSIDENT DE SÉANCE")}</p>
              <p><strong>Secrétaire de séance :</strong> {renderField(secretaire, "SECRÉTAIRE DE SÉANCE")}</p>
              <p><strong>Conseillers en exercice :</strong> {membres || "43"} | <strong>Présents :</strong> {presents || "38"} | <strong>Représentés :</strong> {representes || "4"} | <strong>Votants :</strong> {Number(presents || 0) + Number(representes || 0)}</p>
            </div>

            <h4 className="text-center font-bold text-base mb-6 uppercase tracking-wide">
              OBJET : {actionType === "creation" ? "CRÉATION D'UN EMPLOI PERMANENT" : "SUPPRESSION D'UN EMPLOI VACANT"} AU TABLEAU DES EFFECTIFS<br/>
              <span className="text-sm normal-case font-normal">
                {libelle ? libelle : "[LIBELLÉ DU POSTE]"} - Direction : {structures.filter(Boolean).join(" / ") || "[STRUCTURE]"}
              </span>
            </h4>

            <div className="space-y-4 text-justify">
              <p><strong>Le Conseil Municipal,</strong></p>
              
              <p><strong>Vu</strong> le code général des collectivités territoriales, et notamment ses articles L. 2121-29 et suivants,</p>
              <p><strong>Vu</strong> le code général de la fonction publique (CGFP), et notamment ses articles L. 313-1{actionType === "creation" && ouvertContractuel ? " et L. 332-8" : ""},</p>
              {selectedCadre && (
                <p><strong>Vu</strong> le décret statutaire régissant le cadre d'emplois des {selectedCadre.nom},</p>
              )}
              <p><strong>Vu</strong> le tableau des effectifs budgétaires de la collectivité,</p>
              <p><strong>Vu</strong> l'avis du Comité Social Territorial (CST) en date du {renderField("", "DATE DE CONSULTATION DU CST")},</p>

              <p>
                <strong>Considérant</strong> {actionType === "creation" 
                  ? `qu'il y a lieu de créer un emploi permanent afin de pourvoir aux besoins du service pour le motif suivant : ${motifAction}.` 
                  : `que l'emploi n° ${numPoste || "[NUMÉRO]"} est demeuré vacant et que sa suppression est devenue opportune.`}
              </p>

              <div className="text-center font-bold my-6 uppercase">DÉLIBÈRE ET DÉCIDE</div>

              <p><strong>ARTICLE 1 :</strong><br/>
                {actionType === "creation" ? (
                  <>
                    Est décidée la création, à compter du {renderField(dateEffet, "DATE D'EFFET")}, d'un emploi permanent de <strong>{renderField(libelle, "LIBELLÉ DU POSTE")}</strong> (Poste n° {renderField(numPoste, "NUMÉRO")}) à temps {quotite === 100 ? "complet (35h hebdomadaires)" : `non complet à raison de ${quotite}% (${heuresHebdo} hebdomadaires)`}.
                    Cet emploi relève du cadre d'emplois des <strong>{selectedCadre ? selectedCadre.nom : renderField("", "CADRE D'EMPLOIS")}</strong> (Catégorie {selectedCadre ? selectedCadre.categorie : renderField("", "CAT")}), au grade de <strong>{selectedGrade ? selectedGrade.nom : (cadreId ? "l'un des grades du cadre d'emplois" : renderField("", "GRADE"))}</strong>.
                  </>
                ) : (
                  <>
                    Est décidée la suppression, à compter du {renderField(dateEffet, "DATE D'EFFET")}, de l'emploi permanent de <strong>{renderField(libelle, "LIBELLÉ DU POSTE")}</strong> (Poste n° {renderField(numPoste, "NUMÉRO")}) à temps {quotite === 100 ? "complet" : `non complet (${quotite}%)`}.
                  </>
                )}
              </p>

              {actionType === "creation" && ouvertContractuel && (
                <p><strong>ARTICLE 2 :</strong><br/>
                  Conformément à l'article L. 332-8 du code général de la fonction publique, en cas de recrutement infructueux d'un fonctionnaire titulaire ou stagiaire, cet emploi pourra être pourvu par un agent contractuel de droit public recruté par contrat à durée déterminée d'une durée maximale de 3 ans, renouvelable par reconduction expresse dans la limite maximale de 6 ans.
                </p>
              )}

              {actionType === "creation" && (
                <p><strong>ARTICLE 3 :</strong><br/>
                  La rémunération de l'agent nommé sur cet emploi sera fixée par référence à la grille indiciaire du grade correspondant, complétée par les primes et indemnités instituées par les délibérations applicables au sein de la collectivité, notamment le RIFSEEP (IFSE et CIA).
                </p>
              )}

              <p><strong>ARTICLE {actionType === "creation" && ouvertContractuel ? "4" : "2"} :</strong><br/>
                Les crédits nécessaires à la rémunération et aux charges sociales sont inscrits au budget principal de l'exercice en cours, au chapitre 012 (charges de personnel).
              </p>

              <p><strong>ARTICLE {actionType === "creation" && ouvertContractuel ? "5" : "3"} :</strong><br/>
                Monsieur le Maire, ou l'élu délégué aux Ressources Humaines, est autorisé à signer tout contrat, arrêté ou acte afférent à l'exécution de la présente délibération.
              </p>

              {/* RÉSULTAT DU VOTE */}
              <div className="border-t border-slate-300 pt-4 mt-6">
                <p><strong>Résultat du vote :</strong></p>
                <p className="mt-1">
                  • <strong>Pour :</strong> {pour || "42"}<br/>
                  • <strong>Contre :</strong> {contre || "0"}<br/>
                  • <strong>Abstentions :</strong> {abstentions || "0"}
                </p>
                <p className="mt-2 font-bold italic">
                  {Number(contre || 0) === 0 && Number(abstentions || 0) === 0 ? "Adopté à l'unanimité des suffrages exprimés." : "Adopté à la majorité des voix."}
                </p>
              </div>

              {/* SIGNATURES ET MENTIONS */}
              <div className="mt-10 flex justify-between items-end">
                <div className="w-1/2">
                  <p className="font-bold text-xs mb-10">Le Secrétaire de séance<br/><span className="text-[11px] font-normal italic">{secretaire || "Nom et signature"}</span></p>
                </div>
                <div className="text-right w-1/2">
                  <p>Fait et délibéré en séance, les jour, mois et an susdits.</p>
                  <p className="mt-3 font-bold">Pour extrait certifié conforme,</p>
                  <p className="font-bold">Le Maire,</p>
                  <p className="font-bold">Patrice LECLERC</p>
                  <p className="italic text-xs mt-6">(Signature et cachet de l'autorité)</p>
                </div>
              </div>

              <div className="text-[10px] italic border-t border-slate-300 pt-3 text-slate-500 space-y-1">
                <p>Acte certifié exécutoire compte tenu de sa transmission en Préfecture des Hauts-de-Seine le {renderField(dateTransmPrefecture, "DATE TRANSMISSION")} et de sa publication sur le site internet de la Ville le {renderField(dateAffichage, "DATE PUBLICATION")}.</p>
                <p>La présente délibération peut faire l'objet d'un recours contentieux devant le Tribunal Administratif de Cergy-Pontoise dans un délai de deux mois à compter de sa publication et de sa transmission au représentant de l'État.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
