import React, { useState } from "react";
import { FileSignature, Copy, CheckCircle2, User, Building, Calendar, Info, RefreshCw, CheckCircle } from "lucide-react";
import { fptCadres, echelonsList, getIndicesForGradeAndEchelon } from "../../utils/fptData";

export const ArrReintegration: React.FC = () => {
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

  // 3. MOTIF DE L'ABSENCE PRÉCÉDENTE & RÉINTÉGRATION
  const [motifPrecedent, setMotifPrecedent] = useState<"disponibilite" | "conge_parental" | "detachement">("disponibilite");
  const [dateDemandeReintegration, setDateDemandeReintegration] = useState("");
  const [dateEffet, setDateEffet] = useState("");
  const [dateCertificatMedical, setDateCertificatMedical] = useState("");
  const [directionAffectation, setDirectionAffectation] = useState("Direction Générale des Services");
  const [serviceAffectation, setServiceAffectation] = useState("");
  const [posteOccupe, setPosteOccupe] = useState("");
  const [quotiteTravail, setQuotiteTravail] = useState("temps complet (35h hebdomadaires)");

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

  const getPositionPrecedenteTexte = () => {
    switch (motifPrecedent) {
      case "disponibilite": return "d'une période de mise en disponibilité";
      case "conge_parental": return "d'une période de congé parental";
      case "detachement": return "d'une période de détachement";
      default: return "d'une période d'absence statutaire";
    }
  };

  const selectedCadre = fptCadres.find(c => c.nom === cadreEmplois);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Réintégration / Reprise de fonctions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Générateur d'arrêté de réintégration après disponibilité, congé parental ou détachement (CGFP)
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
                <input type="text" value={numeroArrete} onChange={(e) => setNumeroArrete(e.target.value)} placeholder="Ex: ARR-2026-REINT-007" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
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

          {/* 2. AGENT & GRADE */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Identité & Classement statutaire
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
            </div>
          </div>

          {/* 3. MOTIF D'ABSENCE & AFFECTATION */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Motif de réintégration & Nouvelle affectation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Position antérieure</label>
                <select value={motifPrecedent} onChange={(e) => setMotifPrecedent(e.target.value as any)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white">
                  <option value="disponibilite">Après disponibilité</option>
                  <option value="conge_parental">Après congé parental</option>
                  <option value="detachement">Après détachement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date de la demande de réintégration</label>
                <input type="date" value={dateDemandeReintegration} onChange={(e) => setDateDemandeReintegration(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date d'effet de la reprise</label>
                <input type="date" value={dateEffet} onChange={(e) => setDateEffet(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Direction d'affectation</label>
                <input type="text" value={directionAffectation} onChange={(e) => setDirectionAffectation(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Service</label>
                <input type="text" value={serviceAffectation} onChange={(e) => setServiceAffectation(e.target.value)} placeholder="Ex: Service Jeunesse" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Poste / Fonctions</label>
                <input type="text" value={posteOccupe} onChange={(e) => setPosteOccupe(e.target.value)} placeholder="Ex: Responsable d'animation" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date du certificat médical d'aptitude (médecin agréé)</label>
                <input type="date" value={dateCertificatMedical} onChange={(e) => setDateCertificatMedical(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quotité</label>
                <input type="text" value={quotiteTravail} onChange={(e) => setQuotiteTravail(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
            </div>

          </div>

          <div className="flex items-start gap-2.5 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
            <p>
              La réintégration après une disponibilité de plus de six mois est subordonnée à la vérification par un médecin agréé de l'aptitude physique du fonctionnaire à l'exercice des fonctions correspondant à son grade.
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
                Aperçu officiel de l'arrêté de réintégration
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
                ARRÊTÉ PORTANT RÉINTÉGRATION À TEMPS PLEIN<br/>
                DE {civilite.toUpperCase()} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}
              </h4>

              <div className="space-y-4 text-justify">
                <p><strong>{renderField(titreAutorite, "LE MAIRE")}</strong> de {renderField(collectivite, "COMMUNE DE GENNEVILLIERS")},</p>
                
                <p><strong>Vu</strong> le code général de la fonction publique (CGFP), notamment ses dispositions relatives aux positions statutaires et à la réintégration des fonctionnaires,</p>
                <p><strong>Vu</strong> l'arrêté municipal du 30 mars 2026 portant délégation d'attribution de fonctions et de signature à Monsieur Pierric ANNOOT, 12ème adjoint au Maire délégué aux Ressources Humaines,</p>
                <p><strong>Vu</strong> le décret n° 86-68 du 13 janvier 1986 modifié relatif aux positions de détachement, de disponibilité, de congé parental des fonctionnaires territoriaux,</p>
                <p><strong>Vu</strong> le précédent arrêté en date du {renderField("", "DATE DE L'ARRÊTÉ ANTÉRIEUR")} plaçant {civilite} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")} dans la position {getPositionPrecedenteTexte()},</p>
                <p><strong>Vu</strong> la demande écrite de réintégration formulée par l'agent en date du {renderField(dateDemandeReintegration, "DATE DE LA DEMANDE")},</p>
                {dateCertificatMedical && (
                  <p><strong>Vu</strong> le certificat médical émis en date du {renderField(dateCertificatMedical, "DATE CERTIFICAT")} par le médecin agréé constatant l'aptitude physique de l'intéressé(e) à l'exercice de ses fonctions,</p>
                )}
                <p><strong>Considérant</strong> qu'un emploi vacant correspondant au grade de l'agent est ouvert au tableau des effectifs budgétaires de la collectivité,</p>

                <div className="text-center font-bold mt-8 mb-6">ARRÊTE</div>

                <p><strong>ARTICLE 1 :</strong><br/>
                À compter du {renderField(dateEffet, "DATE D'EFFET")}, {civilite} {renderField(nom.toUpperCase(), "NOM")} {renderField(prenom, "PRÉNOM")}, {renderField(grade, "GRADE")}, est réintégré(e) dans les effectifs de la {renderField(collectivite, "COMMUNE DE GENNEVILLIERS")}.</p>

                <p><strong>ARTICLE 2 :</strong><br/>
                L'intéressé(e) est affecté(e) au sein de la {renderField(directionAffectation, "DIRECTION")} {serviceAffectation ? `(${serviceAffectation})` : ""}, pour y exercer les fonctions de <strong>{renderField(posteOccupe, "INTITULÉ DU POSTE")}</strong> à {renderField(quotiteTravail, "QUOTITÉ")}.</p>

                <p><strong>ARTICLE 3 :</strong><br/>
                L'agent est classé(e) au <strong>{renderField(echelon, "ÉCHELON")}</strong> de son grade, Indice Brut {renderField(indiceBrut, "IB")}, Indice Majoré {renderField(indiceMajore, "IM")}. Il/Elle percevra à compter de la date d'effet mentionnée à l'article 1er le traitement indiciaire brut afférent ainsi que les indemnités et primes attachées à son emploi (RIFSEEP).</p>

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
