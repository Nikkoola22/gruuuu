import React, { useState } from "react";
import { FileText, Copy, CheckCircle2, Building2, User, Users, Calendar, Gavel, Scale, Info, Layers, DollarSign } from "lucide-react";

export const DelibRifseep: React.FC = () => {
  // 1. COLLECTIVITÉ & SÉANCE
  const [collectivite, setCollectivite] = useState("Commune de Gennevilliers");
  const [departement, setDepartement] = useState("Hauts-de-Seine");
  const [organe, setOrgane] = useState("Le Conseil Municipal");
  const [numeroDelib, setNumeroDelib] = useState("");
  const [dateSeance, setDateSeance] = useState("");
  const [president, setPresident] = useState("Monsieur Patrice LECLERC, Maire");
  const [secretaire, setSecretaire] = useState("");
  const [dateCST, setDateCST] = useState("");
  const [dateEffet, setDateEffet] = useState("");

  // 2. CADRES D'EMPLOIS & PLAFONDS IFSE
  const [filieresConcernees, setFilieresConcernees] = useState("Administrative, Technique, Sociale, Animation, Culturelle et Médico-sociale");
  const [ifseG1, setIfseG1] = useState("18 500");
  const [ifseG2, setIfseG2] = useState("12 800");
  const [ifseG3, setIfseG3] = useState("8 600");
  const [ifseG4, setIfseG4] = useState("5 400");

  // 3. CIA
  const [ciaG1, setCiaG1] = useState("3 200");
  const [ciaG2, setCiaG2] = useState("2 400");
  const [ciaG3, setCiaG3] = useState("1 600");
  const [ciaG4, setCiaG4] = useState("1 000");

  // 4. MODALITÉS & MAINTIEN EN CAS DE CONGÉ
  const [maintienMaladie, setMaintienMaladie] = useState("L'IFSE suit le sort du traitement pendant le congé de maladie ordinaire (plein traitement pendant 3 mois, demi-traitement pendant 9 mois).");

  // 5. QUORUM & VOTE
  const [membres, setMembres] = useState("43");
  const [presents, setPresents] = useState("38");
  const [representes, setRepresentes] = useState("4");
  const [pour, setPour] = useState("42");
  const [contre, setContre] = useState("0");
  const [abstentions, setAbstentions] = useState("0");

  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCopy = () => {
    const el = document.getElementById("rifseep-content");
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
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Délibération cadre RIFSEEP (IFSE & CIA)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mise en place ou actualisation du régime indemnitaire tenant compte des fonctions, des sujétions, de l'expertise et de l'engagement professionnel (art. L. 714-4 CGFP).
            </p>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
          <span><strong>Base légale :</strong> Art. L. 714-4 à L. 714-13 CGFP • Décret n° 2014-513 • Art. L. 2121-29 CGCT</span>
          <span className="text-rose-500 font-medium">* Conforme au principe de parité</span>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 1. SÉANCE */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">1</span>
            SÉANCE DU CONSEIL & INSTANCES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Collectivité</label>
              <input type="text" value={collectivite} onChange={(e) => setCollectivite(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">N° Délibération</label>
              <input type="text" value={numeroDelib} onChange={(e) => setNumeroDelib(e.target.value)} placeholder="DEL-2026-RIFSEEP-01" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de la séance</label>
              <input type="date" value={dateSeance} onChange={(e) => setDateSeance(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de l'avis du Comité Social Territorial (CST)</label>
              <input type="date" value={dateCST} onChange={(e) => setDateCST(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de prise d'effet</label>
              <input type="date" value={dateEffet} onChange={(e) => setDateEffet(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Président(e) de séance</label>
              <input type="text" value={president} onChange={(e) => setPresident(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* 2. PLAFONDS IFSE & CIA */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">2</span>
            PLAFONDS ANNUELS MAXIMAUX PAR GROUPE DE FONCTIONS
          </h4>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Filières et cadres d'emplois bénéficiaires</label>
            <input type="text" value={filieresConcernees} onChange={(e) => setFilieresConcernees(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* IFSE */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h5 className="font-bold text-sm text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Part fixe : IFSE (Plafond annuel brut en €)
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 1 (Direction/Encadrement sup)</label>
                  <input type="text" value={ifseG1} onChange={(e) => setIfseG1(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 2 (Responsabilité/Expertise)</label>
                  <input type="text" value={ifseG2} onChange={(e) => setIfseG2(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 3 (Maîtrise/Coordination)</label>
                  <input type="text" value={ifseG3} onChange={(e) => setIfseG3(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 4 (Exécution/Proximité)</label>
                  <input type="text" value={ifseG4} onChange={(e) => setIfseG4(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold" />
                </div>
              </div>
            </div>

            {/* CIA */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h5 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Part variable : CIA (Plafond annuel brut en €)
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 1 (Max CIA)</label>
                  <input type="text" value={ciaG1} onChange={(e) => setCiaG1(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold text-emerald-700" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 2 (Max CIA)</label>
                  <input type="text" value={ciaG2} onChange={(e) => setCiaG2(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold text-emerald-700" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 3 (Max CIA)</label>
                  <input type="text" value={ciaG3} onChange={(e) => setCiaG3(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold text-emerald-700" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Groupe 4 (Max CIA)</label>
                  <input type="text" value={ciaG4} onChange={(e) => setCiaG4(e.target.value)} className="w-full border rounded-lg px-2 py-1.5 font-bold text-emerald-700" />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Règle de maintien en congé de maladie ordinaire (CMO)</label>
            <input type="text" value={maintienMaladie} onChange={(e) => setMaintienMaladie(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
          </div>
        </div>

        {/* 3. VOTE */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm">3</span>
            RÉSULTAT DU VOTE
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Membres en exercice</label>
              <input type="number" min="0" value={membres} onChange={(e) => setMembres(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-2 py-2 text-sm text-center font-semibold text-slate-900 dark:text-white" />
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

        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => setShowResult(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/30 flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Générer la délibération RIFSEEP (.docx via Copier/Coller)
          </button>
        </div>

      </div>

      {/* APERÇU DE LA DÉLIBÉRATION */}
      <div className={`mt-8 transition-all duration-500 ${showResult ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 pointer-events-none hidden'}`}>
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Aperçu officiel de la délibération cadre RIFSEEP
            </h3>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié !" : "Copier pour Word"}
            </button>
          </div>
          
          <div className="p-10 font-serif text-[13px] leading-relaxed text-slate-900 dark:text-slate-200 max-h-[700px] overflow-y-auto" id="rifseep-content">
            
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
              </div>
            </div>

            <h4 className="text-center font-bold text-base mb-6 uppercase tracking-wide">
              OBJET : MISE EN PLACE ET CRITÈRES D'ATTRIBUTION DU RÉGIME INDEMNITAIRE<br/>
              TENANT COMPTE DES FONCTIONS, DES SUJÉTIONS, DE L'EXPERTISE ET DE L'ENGAGEMENT PROFESSIONNEL (RIFSEEP)<br/>
              <span className="text-sm normal-case font-normal">(IFSE et Complément Indemnitaire Annuel - CIA)</span>
            </h4>

            <div className="space-y-4 text-justify">
              <p><strong>Le Conseil Municipal,</strong></p>
              
              <p><strong>Vu</strong> le code général des collectivités territoriales,</p>
              <p><strong>Vu</strong> le code général de la fonction publique (CGFP), notamment ses articles L. 714-4 à L. 714-13 instituant le principe de parité avec les corps homologues de la fonction publique de l'État,</p>
              <p><strong>Vu</strong> le décret n° 2014-513 du 20 mai 2014 modifié portant création du régime indemnitaire tenant compte des fonctions, des sujétions, de l'expertise et de l'engagement professionnel,</p>
              <p><strong>Vu</strong> l'avis préalable rendu par le Comité Social Territorial (CST) en date du {renderField(dateCST, "DATE DE L'AVIS CST")},</p>

              <p>
                <strong>Considérant</strong> qu'il appartient à l'organe délibérant de fixer la nature, les plafonds et les conditions d'attribution des indemnités servies au personnel communal, dans le respect des textes réglementaires de référence,
              </p>

              <div className="text-center font-bold my-6 uppercase">DÉLIBÈRE ET DÉCIDE</div>

              <p><strong>ARTICLE 1 - BÉNÉFICIAIRES :</strong><br/>
                Le régime indemnitaire RIFSEEP est instauré au bénéfice des agents titulaires, stagiaires ainsi que des agents contractuels de droit public de la collectivité exerçant au sein des filières suivantes : {renderField(filieresConcernees, "FILIÈRES CONCERNÉES")}.
              </p>

              <p><strong>ARTICLE 2 - PART FIXE : IFSE :</strong><br/>
                L'Indemnité de Fonctions, de Sujétions et d'Expertise (IFSE) est versée mensuellement. Les emplois sont répartis en groupes de fonctions selon le niveau de responsabilité, la technicité et les sujétions. Les plafonds annuels bruts maximaux applicables sont fixés comme suit :<br/>
                • <strong>Groupe 1 :</strong> {ifseG1} € bruts / an<br/>
                • <strong>Groupe 2 :</strong> {ifseG2} € bruts / an<br/>
                • <strong>Groupe 3 :</strong> {ifseG3} € bruts / an<br/>
                • <strong>Groupe 4 :</strong> {ifseG4} € bruts / an
              </p>

              <p><strong>ARTICLE 3 - PART VARIABLE : COMPLÉMENT INDEMNITAIRE ANNUEL (CIA) :</strong><br/>
                Le Complément Indemnitaire Annuel (CIA) est modulé en fonction de la manière de servir et de l'engagement professionnel de l'agent constatés lors de l'entretien professionnel individuel d'évaluation. Les plafonds annuels bruts maximaux sont fixés à :<br/>
                • <strong>Groupe 1 :</strong> {ciaG1} € bruts / an<br/>
                • <strong>Groupe 2 :</strong> {ciaG2} € bruts / an<br/>
                • <strong>Groupe 3 :</strong> {ciaG3} € bruts / an<br/>
                • <strong>Groupe 4 :</strong> {ciaG4} € bruts / an
              </p>

              <p><strong>ARTICLE 4 - SORT DES PRIMES EN CAS DE CONGÉ :</strong><br/>
                {renderField(maintienMaladie, "RÈGLE EN CAS DE CONGÉ")}<br/>
                L'IFSE et le CIA sont intégralement maintenus pendant les congés annuels, les jours de réduction du temps de travail (RTT) et les congés pour maternité, paternité ou adoption.
              </p>

              <p><strong>ARTICLE 5 - CLAUSE DE REVALORISATION :</strong><br/>
                Le montant individuel de l'IFSE fait l'objet d'un réexamen en cas de changement de fonctions ou d'emploi, de promotion de grade ou au moins tous les 4 ans au vu de l'expérience acquise par l'agent.
              </p>

              <p><strong>ARTICLE 6 - DATE D'EFFET & CRÉDITS :</strong><br/>
                Les présentes dispositions prennent effet au {renderField(dateEffet, "DATE D'EFFET")}. Les crédits correspondants sont inscrits au budget principal, au chapitre 012. Monsieur le Maire est autorisé à fixer par arrêté individuel le montant attribué à chaque agent.
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

              {/* SIGNATURE */}
              <div className="mt-10 flex justify-between items-end">
                <div className="w-1/2">
                  <p className="font-bold text-xs mb-10">Le Secrétaire de séance<br/><span className="text-[11px] font-normal italic">{secretaire || "Nom et signature"}</span></p>
                </div>
                <div className="text-right w-1/2">
                  <p>Fait et délibéré en séance les jour, mois et an susdits.</p>
                  <p className="mt-3 font-bold">Pour extrait certifié conforme,</p>
                  <p className="font-bold">Le Maire,</p>
                  <p className="font-bold">Patrice LECLERC</p>
                  <p className="italic text-xs mt-6">(Signature et cachet de l'autorité)</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
