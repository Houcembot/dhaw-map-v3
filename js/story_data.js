// ===== STORY DATA — narration sections =====
// Each section corresponds to a part of the story, with associated map layers and facts

const STORY_DATA = [
  {
    title: {fr: "1. La pluie abondante", ar: "1. المطر الغزير"},
    content: {
      fr: "Chaque année, 36 milliards de mètres cubes de pluie tombent sur la Tunisie. Mais cette richesse est mal distribuée : le Nord capte 72,6% des ressources sur seulement un tiers du territoire.",
      ar: "كل عام، تسقط 36 مليار متر مكعب من المطر على تونس. لكن هذا الثروة موزعة بشكل سيء: الشمال يلتقط 72,6% من الموارد على ثلث territory فقط."
    },
    fact: {num: "72,6%", cls: "c-blue", lbl: "du total des ressources capté par le Nord (Medjerda, Extrême Nord, Méliane)", detail: "Le système du Tell (Medjerda 36%, Extrême Nord 22%, Méliane 19%) capte 72,6% des apports nationaux sur environ 1/3 du territoire. Source: TD Jaziri 2016 (DGRE)."},
    layers: [], // no specific layers, just context
    graceYear: null
  },
  {
    title: {fr: "2. Le piège de l'évaporation", ar: "2. فخ التبخر"},
    content: {
      fr: "Malgré cette pluie abondante, plus de la moitié s'évapore immédiatement ou file vers la mer. Seule une fraction est réellement capturée par les barrages ou infiltrate les nappes.",
      ar: "على الرغم من هذا المطر الغزير، فإن أكثر من النصف يتبخر فوراً أو يتجه نحو البحر. فقط جزء صغير يتم احتجازه فعلياً بالسدود أو يتسرب إلى الطبقات الجوفية."
    },
    fact: {num: ">50%", cls: "c-red", lbl: "de la pluie perdue par évaporation ou écoulement vers la mer", detail: "En raison du climat semi-aride à aride, l'évaporation potentielle annuelle dépasse souvent 1500 mm, bien supérieure aux précipitations moyennes de 200-400 mm dans de nombreuses régions. Source: TD Jaziri 2016, analyses climatiques."},
    layers: [],
    graceYear: null
  },
  {
    title: {fr: "3. Les barrages : captage saturé", ar: "3. السدود: الشبع في الامتناع"},
    content: {
      fr: "Avec 37 barrages officiels (2,5 km³ de capacité), nous avons déjà mobilisé 92% du potentiel d'eau de surface. Il ne reste presque plus de vallée à barer.",
      ar: "مع 37 سداً رسمياً (2,5 كيلومتر مكعب من السعة)، قمنا بالفعل بتعبئة 92% من إمكانات المياه السطحية. لم يتبق почти أي وادي لتشييد سد."
    },
    fact: {num: "92%", cls: "c-amber", lbl: "du potentiel d'eau de surface déjà mobilisé (2015)", detail: "4,4 km³ mobilisés sur ~4,8 km³ potentiels. La stratégie passe désormais au dessalement et à la réutilisation des eaux usées. Source: Fanack/MARHP 2017."},
    layers: ["barrages-cap", "barrages-label"],
    graceYear: null
  },
  {
    title: {fr: "4. Sidi Salem : le symbole du déclin", ar: "4. سيدي سالم: رمز الانحدار"},
    content: {
      fr: "Le barrage Sidi Salem, construit sur la Medjerda, a perdu 46% de sa surface d'eau entre 2019 et 2025 malgré des pluies normales. Symptôme d'un déséquilibre structurel : évaporation accrue + prélèvements en amont.",
      ar: "سد سيدي سالم، الذي بُني على نهر medjerda، فقد 46% من مساحة مياهه بين 2019 و2025 رغم الأمطار العادية. symptom لاختلال هيكلي: التبخر المتزايد + السحب في المنبع."
    },
    fact: {num: "-46%", cls: "c-amber", lbl: "perte de surface d'eau du barrage Sidi Salem (2019→2025)", detail: "Mesuré par satellite Sentinel-2 (méthode NDWI). La pluie sur le barrage a varié normalement (±40%) mais la surface d'eau a continué de baisser : évaporation + prélèvements. Source: calcul indépendant Copernicus Sentinel-2."},
    layers: ["salem-surface-circle", "salem-surface-label"],
    graceYear: null
  },
  {
    title: {fr: "5. Le transfert Nord→Sud", ar: "5. النقل شمال→جنوب"},
    content: {
      fr: "Pour compenser, nous avons construit un réseau de transfert : le canal Medjerda-Cap Bon (163 Mm³/an) et la conduite Ichkeul-Medjerda acheminent l'eau du Nord riche vers le Sud déficitaire.",
      ar: "للتعويض، بنينا شبكة نقل: قناة medjerda-cape bon (163 مليون متر مكعب/سنة) وقناة ichkeul-medjerda تنقل الماء من الشمال الغني إلى الجنوب العاجز."
    },
    fact: {num: "163 Mm³/an", cls: "c-blue", lbl: "transfert annuel via le canal Medjerda-Cap Bon", detail: "Canal achevé dans les années 2000, transporte l'eau excédentaire du Nord vers le Cap Bon, le Sahel et Sfax. Source: MARHP 2017, ITES 2014."},
    layers: [], // we don't have the exact route geometry, but could add approximate lines
    graceYear: null
  },
  {
    title: {fr: "6. Les nappes : on pompe le passé", ar: "6. الطبقات الجوفية: نضخ الماضي"},
    content: {
      fr: "Au Sud, nous pompons dans des nappes fossiles : l'eau a entre 25 000 et 45 500 ans (moyenne 18 000 ans). Le Sud puise 2,8 fois plus vite que la recharge naturelle.",
      ar: "في الجنوب، نحن نضخ من طبقات جوفية الأحفورية: الماء له عمر بين 25000 و45500 سنة (متوسط 18000 سنة). الجنوب يضخ 2.8 مرة أسرع من إعادة الشحن الطبيعية."
    },
    fact: {num: "×2.8", cls: "c-purple", lbl: "le Sud pompe 2,8 fois plus vite que la recharge des nappes profondes", detail: "Système Aquifère du Sahara Septentrional (partagé avec l'Algérie et la Libye). Répartition du pompage: Complexe Terminal 58%, Continental Intercalaire 18%, Djeffara 24%. L'eau est fossile : âge moyen 18 000 ans. Source: Fanack/TWAP."},
    layers: ["nappes-fill", "nappes-line", "nappes-label"],
    graceYear: null
  },
  {
    title: {fr: "7. GRACE confirme la saignée", ar: "7. GRACE يؤكد النزف"},
    content: {
      fr: "Les satellites NASA GRACE-FO mesurent une perte continue d'eau terrestre depuis 2004 : -17 cm d'équivalent-eau sur l'ensemble du territoire tunisien. Cela confirme que nous consommons plus que ce qui se renouvelle.",
      ar: "الأقمار الصناعية ناسا GRACE-FO تقيس خسارة مستمرة للمياه الأرضية منذ 2004: -17 سم من ما يعادل الماء على كامل الأراضي التونسية. هذا يؤكد أننا نستهلك أكثر مما يتجدد."
    },
    fact: {num: "-17 cm", cls: "c-red", lbl: "perte d'eau terrestre depuis 2004 (équivalent-eau)", detail: "Le satellite GRACE-FO mesure la variation de masse en eau (nappes + barrages + humidité). Anomalie 2026: -17,2 cm vs moyenne 2004-2009. Source: NASA JPL GRACE-FO."},
    layers: ["grace-fill"],
    graceYear: 2026
  },
  {
    title: {fr: "8. La demande explose", ar: "8. الطلب ينفجر"},
    content: {
      fr: "Entre 1960 et 2020, la population est passée de 4,1 à 12 millions d'habitants (×3). La demande totale en eau a elle augmenté de ×3,4 sous l'effet du développement agricole et urbain.",
      ar: "بين 1960 و2020، ارتفع عدد السكان من 4.1 إلى 12 مليون نسمة (×3). الطلب الإجمالي على الماء زاد بـ ×3.4 بسبب التنمية الزراعية والحضرية."
    },
    fact: {num: "×3,4", cls: "c-red", lbl: "augmentation de la demande totale en eau (1960→2020)", detail: "Population: 4,1M → 12M. Demande eau: augmentation due à l'irrigation ×7 (60 000 → 420 000 ha), amélioration du niveau de vie, urbanisation. Source: TD Jaziri 2016, analyses démographiques."},
    layers: [],
    graceYear: null
  },
  {
    title: {fr: "9. L'agriculture : 81% de la consommation", ar: "9. الزراعة: 81% من الاستهلاك"},
    content: {
      fr: "L'agriculture consomme 81% de l'eau mobilisée en Tunisie. Pourtant, l'efficience moyenne des réseaux d'irrigation n'est que 59% (norme 80%) : beaucoup d'eau irrigue... les fuites des canaux.",
      ar: "الزراعة تستهلك 81% من الماء المعبأ في تونس. ومع ذلك، فإن كفاءة شبكات الري المتوسطة هي فقط 59% (المعيار 80%): الكثير من الماء يروى... تسرب القنوات."
    },
    fact: {num: "81%", cls: "c-amber", lbl: "de l'eau consommée va à l'agriculture", detail: "L'irrigation a connu une expansion ×7 depuis 1960 (60 000 → 420 000 ha = 8% des terres cultivées). Mais l'efficience moyenne des réseaux reste faible (59%) à cause des fuites et des techniques anciennes. Source: Fanack/MARHP 2017, ITES 2014."},
    layers: [],
    graceYear: null
  },
  {
    title: {fr: "10. Fuites réseau : le vrai gaspillage", ar: "10. تسرب الشبكة: الهدر الحقيقي"},
    content: {
      fr: "Le rendement du réseau d'eau potable n'est que 70,3% : 30% de l'eau traitée est perdue dans les fuites avant d'arriver au robinet. Réparer ces fuites économiserait 86 Mm³/an — l'équivalent de 4 usines de dessalement d'eau de mer !",
      ar: "كفاءة شبكة مياه الشرب هي فقط 70,3%: 30% من الماء المعالج يضيع في التسربات قبل الوصول إلى الصنبور. إصلاح هذه التسربات سيوفر 86 مليون متر مكعب/سنة — ما يعادل 4 محطات تحلية مياه البحر!"
    },
    fact: {num: "30%", cls: "c-red", lbl: "de l'eau potable perdue dans les fuites réseau", detail: "Rendement réseau AEP 2017 : 70,3%. Économie potentielle de réparation : 86 Mm³/an. Source: Fanack/MARHP 2017, SONEDE chiffres clés."},
    layers: [],
    graceYear: null
  },
  {
    title: {fr: "11. Dessalement : l'illusion de l'abondance", ar: "11. التحلية: وهم الوفرة"},
    content: {
      fr: "Face à la crise, nous rêvons de dessalement de l'eau de mer. Mais 5 stations prévues (Djerba, Sousse, Zarat, Sfax, Kerkennah) représentent encore une goutte d'eau par rapport aux besoins. De plus, le coût énergétique et environnemental est élevé.",
      ar: " diante الأزمة، نحلم بتحلية مياه البحر. لكن 5 محطات مخطط لها (جرابة، سوسة، זرقات، صفاقس، قرقنة) تمثل لا تزال قطرة ماء مقارنة بالاحتياجات. inoltre، تكلفة الطاقة والتأثير البيئي عالية."
    },
    fact: {num: "5 stations", cls: "c-blue", lbl: "projets de dessalement d'eau de mer planifiés", detail: "Djerba, Sousse, Zarat/Gabès, Sfax, Kerkennah. Source: Fanack/MARHP 2017. Coût énergétique élevé: osmose inverse nécessite 3-4 kWh/m³."},
    layers: ["dessalem-icon"],
    graceYear: null
  },
  {
    title: {fr: "12. L'eau en bouteille : symptôme de la pénurie", ar: "12. الماء المعبأ: أعراض الندرة"},
    content: {
      fr: "Face à l'incertitude du robinet, les Tunisiens se tournent vers l'eau en bouteille. 70% du marché appartient à un seul groupe (SFBT). Chaque bouteille représente une pression supplémentaire sur les nappes locales, souvent déjà en surpompage.",
      ar: " frente إلى عدم وضوح الصنبور، يتجه التوانسيون نحو الماء المعبأ. 70% من السوق ينتمي لمجموعة واحدة (SFBT). كل bouteille تمثل ضغطًا إضافيًا على الطبقات الجوفية المحلية، spesso già في過掘削."
    },
    fact: {num: "70%", cls: "c-purple", lbl: "du marché de l'eau en bouteille contrôlé par SFBT", detail: "SFBT détient Safia, Sabrine, Marwa, Hayet, Fourat, Jannet, Oktor, Garci... La production nationale est passée de 110 millions de bouteilles (1995) à 483 millions (2007). Source: Wikipedia (références presse). Chaque bouteille = eau pompée localement."},
    layers: ["marques-circle", "marques-label"],
    graceYear: null
  },
  {
    title: {fr: "13. Vers une solution : sobriété + reuse", ar: "13. نحو الحل: الاعتدال + إعادة الاستخدام"},
    content: {
      fr: "Le seul chemin durable : réduire les pertes (fuites réseau 30%), améliorer l'efficience de l'irrigation (de 59% à 80%), réutiliser les eaux usées (seulement 20% actuellement traitées par ONAS sont réutilisées), et gérer la demande plutôt que de chercher toujours plus d'offre.",
      ar: "الطريق المستدام الوحيد: تقليل الخسائر (تسرب الشبكة 30%), تحسين كفاءة الري (من 59% إلى 80%), إعادة استخدام المياه العادمة (فقط 20% حاليًا معالجتها بواسطة ONAS يتم إعادة استخدامها)، وإدارة الطلب بدلاً من السعي وراء المزيد من العرض."
    },
    fact: {num: "20%", cls: "c-green", lbl: "seulement 20% des eaux usées traitées sont réutilisées", detail: "ONAS traite 242 Mm³ d'eaux usées annuellement mais seulement ~20% sont réutilisés en agriculture. Le reste est rejeté en mer ou perdu. Source: ONAS, MARHP 2017."},
    layers: [],
    graceYear: null
  }
];