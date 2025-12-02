export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'temps-travail' | 'formation' | 'conges' | 'absences' | 'general';
}

export const faqData: FAQItem[] = [
  {
    id: 26,
    question: "J'ai droit à combien de jours de télétravail mobile ?",
    answer: "À la mairie de Gennevilliers, le forfait télétravail annuel est de 15 jours par an, à utiliser dans la limite de 3 jours maximum par mois. Ce forfait s'ajoute à votre jour fixe de télétravail hebdomadaire, sans dépasser un total de 2 jours de télétravail par semaine. Pour les agents à temps partiel en dessous de 80%, ce forfait est proratisé en fonction du temps de travail. En cas de non-utilisation, le report des jours de forfait n'est pas possible. Pour toute demande d'utilisation des jours de forfait, elle doit être validée par la hiérarchie au moins 5 jours à l'avance.",
    category: 'general'
  },
  {
    id: 27,
    question: "Je peux mettre combien de jours dans mon CET ?",
    answer: "Tu peux mettre au maximum **5 jours de congés annuels** et **2 jours de fractionnement** ainsi que 50 % des jours de **A.R.T.T** dans ton CET chaque année, à condition d'avoir pris au moins 20 jours de congés annuels dans l'année en cours. La demande d'ouverture ou d'alimentation du CET se fait avec les formulaires disponibles sur l'intranet.\n\nSeuls les agents employés de manière continue depuis au moins 1 an peuvent alimenter un CET, et les fonctionnaires stagiaires ne sont pas concernés pendant la période de stage.",
    category: 'conges'
  },
  {
    id: 1,
    question: "Quelle est la durée légale du temps de travail ?",
    answer: "La durée légale du temps de travail est de 1607 heures par an, répartie sur la base de 35 heures par semaine. Cette durée peut être organisée selon différents cycles hebdomadaires en fonction des services.",
    category: 'temps-travail'
  },
  {
    id: 2,
    question: "Comment fonctionnent les plages fixes et les plages de souplesse ?",
    answer: "Les **plages fixes** et les **plages de souplesse** permettent d'organiser le temps de travail avec une certaine flexibilité tout en garantissant la présence des agents pendant les périodes essentielles.\n\n- **Plages fixes (présence obligatoire)** :\n  Ce sont les périodes pendant lesquelles tous les agents doivent impérativement être présents. À Gennevilliers, les plages fixes sont généralement :\n  - Le matin : de **9h30 à 11h30**\n  - L'après-midi : de **14h00 à 16h00**\n\n- **Plages de souplesse (flexibilité)** :\n  Ces plages permettent aux agents de choisir leurs heures d'arrivée et de départ, dans le respect du temps de travail quotidien. Elles se situent :\n  - Le matin : de **7h30 à 9h30** (arrivée)\n  - Le midi : de **11h30 à 14h00** (pause méridienne)\n  - Le soir : de **16h00 à 19h00** (départ)\n\n- **Pause méridienne** :\n  Une pause déjeuner d'au moins **45 minutes** est obligatoire. Cette pause doit être prise entre 11h30 et 14h00.\n\n- **Amplitude journalière** :\n  La durée maximale de travail quotidien ne peut pas dépasser **10 heures**. L'amplitude horaire (entre l'arrivée et le départ) ne peut pas excéder **12 heures**.\n\n- **À savoir** :\n  - Les horaires peuvent varier selon les services et les cycles de travail.\n  - Le badgeage permet de contrôler le respect des plages fixes.\n  - En cas de nécessité de service, le chef de service peut demander une présence en dehors des plages fixes habituelles.",
    category: 'temps-travail'
  },
  {
    id: 3,
    question: "Quelles sont les conditions pour bénéficier du temps partiel ?",
    answer: "Le temps partiel peut être accordé de droit ou sur autorisation selon les situations. Il faut respecter une quotité minimale et les modalités varient selon que vous soyez fonctionnaire ou contractuel. La rémunération et les congés sont calculés au prorata du temps travaillé.",
    category: 'temps-travail'
  },
  {
    id: 4,
    question: "Comment sont rémunérées les heures supplémentaires ?",
    answer: "Les heures supplémentaires sont rémunérées uniquement si elles sont effectuées à la demande de la hiérarchie, concernent les agents titulaires et non titulaires de catégorie B et C, et dépassent le temps de travail normal de l'agent.\n\n- **Elles donnent prioritairement droit à une récupération majorée**, à effectuer dans un délai de deux mois.\n- **Majoration de récupération** :\n  - Pour les 14 premières heures : +25%\n  - De la 15ème à la 25ème heure : +27%\n  - Heures de nuit (22h à 7h) : +100%\n  - Heures effectuées le dimanche et jours fériés : +66%\n  - Ces majorations peuvent se cumuler entre elles.\n\n- **Exemple de récupération** :\n  - 1 heure supplémentaire \"classique\" donne droit à 1h15 à récupérer pour les 14 premières heures, 1h17 de la 15ème à la 25ème.\n  - 1 heure de nuit donne droit à 2h30 (pour les 14 premières) ou 2h34 (de la 15ème à la 25ème).\n  - 1 heure le dimanche donne droit à 2h05 (pour les 14 premières) ou 2h07 (de la 15ème à la 25ème).\n\n- **Indemnisation à titre exceptionnel** : si la récupération n'a pas été possible, elles peuvent être indemnisées sur demande du chef de service et selon les mêmes taux de majoration.\n\n- **Limite** : pas plus de 25 heures supplémentaires par mois. Elles doivent être formalisées et validées par le chef de service.",
    category: 'temps-travail'
  },
  {
    id: 5,
    question: "Combien dure la journée de solidarité ?",
    answer: "La journée de solidarité représente 7 heures de travail supplémentaires par an. Elle peut être fractionnée et prise sur des jours RTT, des jours fériés ou des congés selon les modalités définies par la collectivité.",
    category: 'temps-travail'
  },
  {
    id: 6,
    question: "Combien de jours de congés annuels ai-je droit ?",
    answer: "Vous avez droit à 25 jours ouvrés de congés annuels par an (soit 5 semaines). Ces congés peuvent être fractionnés et doivent être pris avant le 31 décembre. Pour les agents à temps partiel, les congés sont calculés au prorata.",
    category: 'conges'
  },
  {
    id: 7,
    question: "Comment fonctionnent les jours d'ARTT ?",
    answer: "Les **jours d'ARTT** (Aménagement et Réduction du Temps de Travail) sont des journées de repos attribuées pour compenser le fait de travailler plus de 35 heures par semaine. Ils permettent de ne pas dépasser le plafond annuel de 1607 heures de travail.\n\n- **Qui y a droit ?**  \nTu peux bénéficier des ARTT si tu travailles à temps complet avec une durée hebdomadaire supérieure à 35h (par exemple : 37h, 37,5h, 38h ou 39h selon les cycles en vigueur à Gennevilliers), ou à temps partiel (le nombre de jours d'ARTT est alors au prorata de ton temps de travail).\n\n- **Combien de jours d'ARTT ?**  \nLe nombre de jours dépend de ton temps de travail hebdomadaire. Par exemple :  \n  - 37h : 12 jours d'ARTT par an  \n  - 37,5h : 15 jours  \n  - 38h : 18 jours  \n  - 39h : 23 jours  \nCe nombre est réduit proportionnellement si tu as des absences pour maladie dans l'année.\n\n- **Comment poser ses ARTT ?**  \nIls se posent en journée ou demi-journée, comme les congés annuels. Les règles et délais de demande sont les mêmes que pour les congés annuels :  \n  - Hors période estivale, 1 mois à l'avance pour 5 à 10 jours, 15 jours avant pour moins de 5 jours, et 5 jours ouvrés avant pour une journée.  \n  - 50 % des jours d'ARTT doivent être pris avant le 15 septembre.\n\n- **ARTT non pris :**  \nÀ la fin de l'année, les jours d'ARTT non pris peuvent être versés sur ton compte épargne-temps (CET) selon les règles définies, sinon ils sont perdus.\n\n- **Attention :**\n  - Les absences pour raisons de santé diminuent le nombre de jours d'ARTT acquis : un système de « quotient de réduction » fait qu'après un certain nombre d'absences, une journée d'ARTT est retirée.\n  - Les agents sur emplois saisonniers ou aux contrats courts doivent impérativement poser leurs ARTT avant la fin de contrat.\n\nN'oublie pas que les jours non travaillés automatiquement (JNT) ne sont pas des ARTT et qu'ils sont planifiés directement par le service, contrairement aux ARTT qui sont à ta main sous réserve des nécessités de service.",
    category: 'conges'
  },
  {
    id: 8,
    question: "Qu'est-ce que le don de jours de repos ?",
    answer: "Le don de jours permet de céder des jours RTT ou congés annuels à un collègue pour l'aide à un proche ou un enfant malade. Le don est limité à 31 jours et nécessite des justificatifs médicaux.",
    category: 'conges'
  },
 
  {
    id: 10,
    question: "Quels sont mes droits en cas de congé maternité ?",
    answer: "Le congé maternité varie selon le nombre d'enfants et les circonstances (grossesse multiple, hospitalisation). La durée et les conditions d'indemnisation sont définies par la réglementation. Des autorisations spéciales peuvent être accordées pour les consultations médicales.",
    category: 'conges'
  },
  {
    id: 11,
    question: "Puis-je m'absenter pour garde d'enfant malade ?",
    answer: "Oui, tu peux t'absenter pour garde d'enfant malade, sous certaines conditions.\n\nVoici les règles principales concernant l'absence pour garde d'enfant :\n- **L'autorisation d'absence est prévue si tu dois soigner un enfant malade ou assurer momentanément sa garde à cause d'une situation imprévue**, par exemple si l'enfant ou sa nourrice est malade, ou si la crèche ou l'école est fermée.\n- **La garde d'enfant est acceptée aussi en cas de mouvement de grève** entraînant des problèmes de garde.\n- **L'autorisation n'est pas accordée pour accompagner un enfant à une consultation médicale prévue** (sauf maladie grave ou handicap).\n- **L'autorisation est accordée jusqu'aux 16 ans de l'enfant** (sans limite d'âge si l'enfant est handicapé), peu importe le nombre d'enfants.\n- Pour les agents à temps complet : **6 jours par an** maximum.\n- Pour les agents à temps partiel : le nombre de jours est calculé au prorata (exemple, pour un agent à 60 % : 4 jours).\n- Ces jours peuvent être pris **en fractionné ou en continu**, selon le besoin.\n- **La durée peut être doublée** si tu assumes seul la charge de l'enfant ou si ton conjoint recherche un emploi ou n'a pas d'autorisation d'absence rémunérée, sur justificatif.\n- Si ton conjoint bénéficie d'un nombre d'autorisations moins élevé que le tien, tu peux obtenir la différence en supplément.\n- Pour la première demande, il faut fournir une attestation de l'employeur du conjoint précisant ses droits à autorisation.\n- La demande se fait auprès du responsable de service, puis transmise à la RH (Service GCR), avec le formulaire disponible sur l'intranet.\n\nN'oublie pas de prévenir ton responsable hiérarchique dès que possible et de présenter les justificatifs nécessaires. \n\nTu ne peux pas venir travailler avec ton enfant en cas de difficulté de garde. Les jours non utilisés ne sont pas reportés sur l'année suivante.",
    category: 'absences'
  },
  {
    id: 12,
    question: "Quelles autorisations pour les fêtes religieuses ?",
    answer: "Des autorisations d'absence peuvent être accordées pour les principales fêtes religieuses (musulmanes, juives, chrétiennes orthodoxes) selon le calendrier établi par la préfecture. Ces absences peuvent être récupérées ou prises sur RTT/congés.",
    category: 'absences'
  },
  {
    id: 13,
    question: "Combien de jours en cas de décès familial ?",
    answer: "Des **autorisations spéciales d'absence** sont accordées en cas de décès d'un proche. Le nombre de jours varie selon le lien de parenté :\n\n- **Décès du conjoint, partenaire de PACS ou concubin** : **5 jours ouvrables**\n- **Décès d'un enfant** : **5 jours ouvrables** (+ 8 jours supplémentaires si l'enfant avait moins de 25 ans ou était lui-même parent)\n- **Décès du père ou de la mère** : **3 jours ouvrables**\n- **Décès d'un beau-parent (parent du conjoint)** : **3 jours ouvrables**\n- **Décès d'un frère ou d'une sœur** : **3 jours ouvrables**\n- **Décès des grands-parents** : **1 jour ouvrable**\n- **Décès des beaux-frères, belles-sœurs** : **1 jour ouvrable**\n- **Décès des oncles, tantes, neveux, nièces** : **1 jour ouvrable**\n\n**Conditions et modalités** :\n- Ces jours doivent être pris dans un délai raisonnable autour de la date du décès (généralement dans les 15 jours).\n- Un **justificatif** (acte de décès, certificat de décès) est obligatoire.\n- Un **délai de route** peut être accordé en supplément si les obsèques ont lieu à plus de 300 km (1 jour) ou à plus de 600 km (2 jours).\n- Ces jours sont rémunérés et n'impactent pas les congés annuels.\n\nEn cas de circonstances particulières, un congé exceptionnel supplémentaire peut être demandé au chef de service.",
    category: 'absences'
  },
  {
    id: 14,
    question: "Puis-je m'absenter pour déménagement ?",
    answer: "Une autorisation d'absence d'une journée est généralement accordée pour déménagement sur présentation de justificatifs (bail, acte de vente). Cette autorisation doit être demandée avec un préavis suffisant.",
    category: 'absences'
  },
  {
    id: 15,
    question: "Comment sont prises en charge les formations obligatoires ?",
    answer: "Les formations obligatoires (intégration, professionnalisation, hygiène-sécurité) sont prises en charge par l'employeur ou le CNFPT. Les frais de transport et d'hébergement sont remboursés selon les barèmes en vigueur.",
    category: 'formation'
  },
  {
    id: 16,
    question: "Qu'est-ce que la formation d'intégration ?",
    answer: "La formation d'intégration est obligatoire pour tous les nouveaux agents. Elle dure 10 jours pour les catégories A et B, 5 jours pour la catégorie C. Elle doit être réalisée dans l'année suivant la nomination et conditionne la titularisation.",
    category: 'formation'
  },
  {
    id: 17,
    question: "Comment utiliser mon Compte Personnel de Formation (CPF) ?",
    answer: "Le **Compte Personnel de Formation (CPF)** te permet de cumuler des heures de formation tout au long de ta carrière et de les utiliser pour te former.\n\n**Alimentation du CPF** :\n- **25 heures par an** pour un agent à temps complet\n- Proratisé pour les agents à temps partiel\n- **Plafond : 150 heures** maximum (les heures au-delà du plafond ne sont pas perdues mais reportées)\n- Les agents de catégorie C sans diplôme bénéficient de **50 heures par an** (plafond 400h)\n\n**Types de formations éligibles** :\n- Formations **diplômantes** ou **certifiantes** (inscrites au RNCP)\n- Préparation aux **concours** et examens professionnels de la fonction publique\n- Formations au **socle de connaissances de base** (Cléa) : français, calcul, numérique...\n- Bilans de compétences\n- Validation des Acquis de l'Expérience (VAE)\n\n**Comment faire une demande ?** :\n1. Consulter ton solde d'heures CPF auprès de la DRH ou sur ton espace personnel\n2. Identifier la formation souhaitée\n3. Remplir le formulaire de demande CPF (disponible sur l'intranet)\n4. Transmettre la demande à ton responsable et à la DRH **au moins 2 mois avant** le début de la formation\n5. Attendre la validation de l'employeur\n\n**Accord de l'employeur** :\nL'employeur doit donner son accord sur :\n- La **nature** de la formation\n- Le **calendrier** (dates et durée)\n- Le **financement** (prise en charge des frais)\n\n**En cas de refus** :\n- L'employeur doit motiver sa décision\n- Après **2 refus successifs** pour la même formation, le 3ème refus ne peut être prononcé qu'après avis de la commission paritaire\n- Pour les formations du socle de base, l'employeur peut uniquement reporter d'**1 an maximum**\n\n**Bon à savoir** :\n- Le CPF est portable : tu conserves tes heures même en cas de changement d'employeur public\n- Les heures non utilisées ne sont jamais perdues",
    category: 'formation'
  },
  {
    id: 18,
    question: "Puis-je préparer un concours sur mon temps de travail ?",
    answer: "Oui, des formations de préparation aux concours sont proposées. Les jours d'épreuves sont accordés sur temps de travail pour les concours de la fonction publique territoriale. Des congés de préparation peuvent être accordés avant les épreuves.",
    category: 'formation'
  },
  {
    id: 19,
    question: "Qu'est-ce que la VAE (Validation des Acquis de l'Expérience) ?",
    answer: "La VAE permet d'obtenir un diplôme grâce à l'expérience professionnelle. Un congé de 24h (72h pour certains agents) peut être accordé. La prise en charge dépend des priorités de la collectivité et du budget formation.",
    category: 'formation'
  },
  {
    id: 20,
    question: "Comment s'inscrire à une formation CNFPT ?",
    answer: "L'inscription se fait uniquement en ligne sur le compte IEL (www.cnfpt.fr). Après sélection de la formation, la demande est validée par la hiérarchie puis par le service DCRH. Les agents peuvent être aidés pour créer leur compte.",
    category: 'formation'
  },
  {
    id: 21,
    question: "Que faire en cas d'arrêt maladie ?",
    answer: "L'arrêt maladie doit être transmis rapidement au service RH. La rémunération est maintenue selon des modalités précises. Un certificat médical est obligatoire. Les agents en arrêt ne peuvent pas participer aux formations sauf cas particuliers de reconversion.",
    category: 'absences'
  },
  {
    id: 22,
    question: "Comment déclarer un accident de service ?",
    answer: "L'accident de service doit être déclaré immédiatement à la hiérarchie. Une prise en charge spécifique est prévue avec maintien de la rémunération. Les soins sont pris en charge et un arrêt de travail peut être prescrit.",
    category: 'absences'
  },
  {
    id: 23,
    question: "Puis-je cumuler plusieurs emplois ?",
    answer: "En tant qu'agent public, tu es soumis à une **obligation d'exclusivité** : tu dois consacrer l'intégralité de ton activité professionnelle à ton emploi public. Cependant, certaines **dérogations** existent.\n\n**Activités librement autorisées (sans demande préalable)** :\n- Gestion de ton **patrimoine personnel ou familial**\n- Production d'**œuvres de l'esprit** (livres, créations artistiques...) dans le respect du devoir de réserve\n- Exercice d'une **profession libérale** découlant de la nature de tes fonctions (pour certains agents)\n- Activités **bénévoles** au profit de personnes publiques ou privées à but non lucratif\n- **Aide à domicile** à un ascendant, descendant, conjoint ou partenaire\n- Activités d'**enseignement** ou de **formation** en lien avec ta profession\n\n**Activités soumises à déclaration préalable** :\n- Création ou reprise d'une **entreprise** ou d'une **auto-entreprise**\n- Poursuite d'une activité au sein d'une entreprise existante\n- Activité de **conjoint collaborateur** dans une entreprise artisanale, commerciale ou libérale\n\n**Activités soumises à autorisation** :\n- Exercer une **activité accessoire** rémunérée (expertise, conseil, enseignement hors fonction publique...)\n- La demande doit être adressée à l'autorité hiérarchique qui dispose de **1 mois** pour répondre\n\n**Conditions à respecter** :\n- L'activité ne doit pas porter atteinte au **fonctionnement normal** du service\n- Elle ne doit pas mettre en cause ton **indépendance** ou ta **neutralité**\n- Elle ne doit pas nuire à la **dignité** de tes fonctions\n- Le cumul ne doit pas dépasser les **durées maximales de travail** autorisées\n\n**Agents à temps partiel** :\nLes agents à temps partiel peuvent plus facilement exercer une activité privée lucrative, sous réserve d'en informer l'administration.\n\n**Sanctions en cas de non-respect** :\n- Rappel à l'ordre\n- Obligation de cesser l'activité\n- Reversement des sommes indûment perçues\n- Poursuites disciplinaires\n\n**Comment faire ?**\nAdresse ta demande écrite à la DRH en précisant la nature de l'activité, sa durée, et les conditions d'exercice. Un formulaire est disponible sur l'intranet.",
    category: 'general'
  },
  {
    id: 24,
    question: "Comment faire une demande de télétravail ?",
    answer: "Le télétravail est soumis à autorisation selon les modalités définies par la collectivité. Il faut respecter les conditions d'éligibilité du poste, disposer d'un équipement adapté et signer une convention. Des formations peuvent être proposées.",
    category: 'general'
  },
  {
    id: 25,
    question: "Où trouver les textes réglementaires ?",
    answer: "Les textes réglementaires sont disponibles sur Légifrance, le site du ministère de la Fonction Publique, et sur le portail de la fonction publique territoriale. Pour la jurisprudence administrative, consultez le site opendata.justice-administrative.fr.",
    category: 'general'
  },
  {
    id: 28,
    question: "Combien de fois peut-on me refuser ma formation ?",
    answer: "On ne peut pas te refuser plus de deux fois la même formation sans avis de la commission paritaire compétente. Après deux refus successifs, l'avis de cette commission devient obligatoire et, dans certains cas (comme pour la lutte contre l'illettrisme, le perfectionnement ou certaines formations du CNFPT), tu bénéficies même d'une priorité d'accès à la formation demandée si l'employeur n'a pas accordé l'autorisation deux années de suite. \n\nPour le CPF, le troisième rejet d'une formation de même nature ne peut être prononcé qu'après avis de l'instance paritaire compétente. Pour les formations relevant du socle de connaissances de base (ex : communication en français, calcul…), l'employeur ne peut pas s'y opposer durablement, seulement demander un report d'un an maximum en raison des nécessités de service. ",
    category: 'formation'
  }
];

// (les questions ajoutées ont été intégrées directement dans \`faqData\` pour apparaître en premier)

export const getFAQByCategory = (category: string): FAQItem[] => {
  return faqData.filter(item => item.category === category);
};

export const searchFAQ = (query: string): FAQItem[] => {
  const q = query.toLowerCase();
  return faqData.filter(item => 
    item.question.toLowerCase().includes(q) || 
    item.answer.toLowerCase().includes(q)
  );
};
