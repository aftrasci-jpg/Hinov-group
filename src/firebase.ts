import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from './firebase-applet-config.json';
import { Product, RealisationItem, BlogArticle, DevisRequest, SiteStats } from './types';

// Standard fallback if config is still placeholder
let isRealFirebase = false;
let app;
let db: any;
let auth: any;
let analytics: any = null;

try {
  // Simple check to see if apiKey is not the mock/placeholder one
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('mock') && !firebaseConfig.apiKey.includes('MY_')) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isRealFirebase = true;
    console.log("Firebase initialized successfully in real production mode.");
    
    // Safely enable analytics if supported by environment
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized.");
      }
    }).catch(err => {
      console.warn("Analytics verification bypassed or not supported.", err);
    });
  } else {
    console.warn("Using Hinov Dual-Suite Fallback (LocalStorage mode). Live Firestore is pending terms setup.");
  }
} catch (e) {
  console.error("Firebase init failed, switching to premium offline-first memory suite.", e);
}

// Ensure database connection check is passive & resilient
if (isRealFirebase) {
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'hinov_connection'));
    } catch (error: any) {
      if (error?.message?.includes('the client is offline')) {
        console.error("Please check your Firebase connectivity.");
      }
    }
  };
  testConnection();
}

// -------------------------------------------------------------
// DUMMY DEFAULT PRE-LOADED DATA
// -------------------------------------------------------------
const defaultProducts: Product[] = [
  // 1. Matériel Informatique
  {
    id: "prod-inf-1",
    name: "Ordinateur portable professionnel",
    category: "Matériel Informatique",
    description: "Ordinateurs portables pro (Dell Latitude, HP EliteBook, Lenovo ThinkPad) avec processeur Intel Core i5/i7, 16 Go de RAM, SSD ultra rapide de 512 Go.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-inf-2",
    name: "Ordinateur de bureau d'entreprise",
    category: "Matériel Informatique",
    description: "PC de bureau et unités centrales pour entreprises (HP ProOne, Lenovo ThinkCentre), idéaux pour les activités administratives et la bureautique.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-inf-3",
    name: "Téléphone fixe professionnel",
    category: "Matériel Informatique",
    description: "Téléphones fixes filaires et téléphones IP/SIP (Panasonic, Yealink) avec voix HD, écran rétroéclairé, gestion d'appels pro.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-inf-4",
    name: "Imprimante Multifonction Professionnelle",
    category: "Matériel Informatique",
    description: "Imprimantes multifonctions laser noir/couleur et copieurs réseau de marques leaders (Canon C3226i, HP, Epson). Impression A3/A4 fluide, haute vitesse.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-inf-5",
    name: "Tablette Tactile Pro (iPad / Galaxy Tab)",
    category: "Matériel Informatique",
    description: "Tablettes tactiles performantes facilitant la prise de notes, l'exposition commerciale, et les relevés de terrain en Côte d'Ivoire.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-inf-6",
    name: "Logiciels de bureau, Antivirus & Divers",
    category: "Matériel Informatique",
    description: "Licences officielles pour entreprises : Microsoft Office Pro / 365, Windows 11 Pro, solutions d'antivirus professionnels, câblage et accessoires informatiques.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600"
  },

  // 2. Fournitures de Bureau
  {
    id: "prod-fub-1",
    name: "Ramette de Papier A4 Double A Premium",
    category: "Fournitures de Bureau",
    description: "Papier haut de gamme de grammage 80g/m², blancheur éclatante, idéal pour photocopies et impressions professionnelles sans bourrage.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-fub-2",
    name: "Papier en-tête & Enveloppes personnalisées",
    category: "Fournitures de Bureau",
    description: "Papertiers et enveloppes élégantes d'entreprise avec marquage de votre identité visuelle et adresse, disponibles en formats DL, C5 et C4.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-fub-3",
    name: "Carnet de reçu & Facturier autocopiant",
    category: "Fournitures de Bureau",
    description: "Carnets de factures, bons de commande ou reçus personnalisés, feuillets autocopiants numérotés pour une traçabilité parfaite.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600"
  },

  // 3. Fournitures Scolaires
  {
    id: "prod-sco-1",
    name: "Cahier de classe scolaire grand format",
    category: "Fournitures Scolaires",
    description: "Cahiers de notes d'étudiants lignés et quadrillés, 100 à 200 pages, reliure solide et résistante pour toute l'année scolaire.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sco-2",
    name: "Calculatrice Scientifique Scientifique HINOV",
    category: "Fournitures Scolaires",
    description: "Calculatrice scientifique multi-fonctions, parfaite pour les lycéens, bacheliers et étudiants universitaires.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-sco-3",
    name: "Maillot d'EPS & Tenues de Sport aux couleurs d'école",
    category: "Fournitures Scolaires",
    description: "Maillots, shorts et débardeurs personnalisés pour l'éducation physique et sportive (EPS), déclinés selon vos couleurs scolaires.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600"
  },

  // 4. Supports de Communication (Grand format & Numérique/Offset)
  {
    id: "prod-sup-1",
    name: "Bâche Publicitaire Grand Format",
    category: "Supports de Communication",
    description: "Impression haute définition sur bâche résistante ou calicot à œillet pour façades de magasin, foires, chantiers ou événements.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-sup-2",
    name: "Vinyle Adhésif & Autocollant de vitrine",
    category: "Supports de Communication",
    description: "Impression et découpe de vinyle publicitaire mat/brillant pour l'habillage de vos enseignes, murs, cloisons ou vitrines d'agence.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sup-3",
    name: "Kakemono / Roll-up publicitaire",
    category: "Supports de Communication",
    description: "Kakemonos durables, disponibles en version 'petit bas' (légers et nomades) ou 'gros bas' (socle premium en aluminium pour stabilité totale).",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-sup-4",
    name: "Adhésif Microperforé pour vitrage",
    category: "Supports de Communication",
    description: "Idéal pour l'habillage des vitrines d'entreprise ou des vitres arrière de véhicules d'intervention sans occulter la lumière intérieure.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sup-5",
    name: "Branding Véhicule & Bâtiment",
    category: "Supports de Communication",
    description: "Marquage publicitaire de votre flotte de camionnettes de livraison, bus ou voitures de société, ainsi que l'habillage complet de façades.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sup-6",
    name: "Calendrier d'Entreprise Mural / Chevalet",
    category: "Supports de Communication",
    description: "Impression de vos calendriers de bureau (format chevalet) ou calendriers muraux sur papier de prestige pour vos cadeaux de fin d'année.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sup-7",
    name: "Imprimerie Offset : Flyers, Dépliants, Brochures & Affiches",
    category: "Supports de Communication",
    description: "Impression de flyers publicitaires en tous formats, affiches A3 événementielles, brochures multipages de luxe et dépliants à plis.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sup-8",
    name: "Cartes de Visite Professionnelles",
    category: "Supports de Communication",
    description: "Cartes de visite classiques, Soft Touch mat, vernis sélectif brillant 3D sur carton extra-rigide 350g/400g.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-sup-9",
    name: "Ticket événementiel sécurisé & Badge PVC",
    category: "Supports de Communication",
    description: "Impression de billets événementiels numérotés avec souche détachable et badges d'identification plastifiés pour visiteurs.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"
  },

  // 5. Textile Personnalisé (Confection Tee-Shirt et Polo)
  {
    id: "prod-tex-1",
    name: "Tee-shirt blanc en coton Premium",
    category: "Textile Personnalisé",
    description: "T-shirt 100% coton de couleur blanche, douceur et résistance optimales, idéal pour impression directe ou sérigraphie de qualité.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-tex-2",
    name: "Tee-shirt couleur en coton Peigné",
    category: "Textile Personnalisé",
    description: "T-shirts coton déclinés dans de nombreux coloris (noir, rouge, bleu royal...), parfaits pour personnaliser votre communication visuelle.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-tex-3",
    name: "Polo blanc en coton Brodé",
    category: "Textile Personnalisé",
    description: "Polo de luxe en maille piquée 100% coton, blanc éclatant, col renforcé avec broderie fine sur-mesure sur poitrine ou col.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-tex-4",
    name: "Polo couleur en coton Brodé",
    category: "Textile Personnalisé",
    description: "Polos haut de gamme disponibles en bleu marine, rouge, jaune, noir, vert pin, broderie fil robuste résistante aux lavages répétés.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-tex-5",
    name: "Tee-shirt événementiel grand public",
    category: "Textile Personnalisé",
    description: "T-shirts légers poly-coton avec impression en sérigraphie rapide pour lancements de masse, campagnes politiques et culturelles.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-tex-6",
    name: "Chasuble & Gilet de sécurité réfléchissant",
    category: "Textile Personnalisé",
    description: "Gilets de haute visibilité auto-réfléchissants conformes de chantiers (orange ou jaune fluo) avec personnalisation de votre logo.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-tex-7",
    name: "Casquette publicitaire personnalisée",
    category: "Textile Personnalisé",
    description: "Casquette ajustable 5 ou 6 panneaux, broderie de logo en relief 3D ou flocage de haute tenue.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600"
  },

  // 6. Objets Publicitaires / Goodies
  {
    id: "prod-obj-1",
    name: "Porte-clé personnalisé (Métal / Plastique)",
    category: "Objets Publicitaires",
    description: "Porte-clés robustes publicitaires en matière plastique moulée ou en métal argenté élégant gravé avec votre slogan.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-obj-2",
    name: "Tasse personnalisée classique & Tasse magique",
    category: "Objets Publicitaires",
    description: "Mugs de bureau en céramique personnalisés par sublimation. Tasse magique thermoréactive changeant de couleur avec la chaleur.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-obj-3",
    name: "Gourde Isotherme métallique personnalisée",
    category: "Objets Publicitaires",
    description: "Bouteille isotherme légère en acier inoxydable, élégante gourde pro gravée au laser (gardant le chaud 12h et le froid 24h).",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
    isPopular: true
  },
  {
    id: "prod-obj-4",
    name: "Stylo Publicitaire personnalisé pro",
    category: "Objets Publicitaires",
    description: "Stylos à bille économiques durables pour foires ou stylos plume haut de gamme présentés en écrin d'affaires de direction.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-obj-5",
    name: "Clé USB rotative personnalisable (16Go / 32Go)",
    category: "Objets Publicitaires",
    description: "Clé USB avec capot métallique pivotant personnalisée par gravure laser ou impression couleurs UV.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-obj-6",
    name: "Sacs de transport : Sac Kaba & Sac Éco Bio (Tote bag)",
    category: "Objets Publicitaires",
    description: "Sacs shopping type cabas (sac kaba) et tote bags en toile de coton bio éco-responsable imprimés à votre identité.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prod-obj-7",
    name: "Tampon Encreur Automatique pro (Trodat)",
    category: "Objets Publicitaires",
    description: "Tampons automatiques solides pour entreprises (société, payé, comptabilité) avec gravure précise de votre texte.",
    price: "Sur devis",
    imageUrl: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=600"
  }
];

const defaultRealisations: RealisationItem[] = [
  {
    id: "real-1",
    title: "Câblage réseau informatique structuré gigabit - Cité CIE, Yopougon, Banque locale",
    category: "Réseaux & Informatique",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "real-2",
    title: "Livraison d'ordinateurs portables, serveurs, téléphones de bureau IP Yealink - Groupe logistique",
    category: "Réseaux & Informatique",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "real-3",
    title: "Branding complet : Habillage adhésif de véhicules utilitaires et camions - Hydroparts",
    category: "Branding Véhicules",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "real-4",
    title: "Production d'un lot de kakemonos et roll-ups publicitaires grand format - Forum d'Innovation",
    category: "Imprimerie",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "real-5",
    title: "Rendu broderie de polos d'équipe pro de couleur bleu et jaune pour HINOV Group",
    category: "Textile Personnalisé",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "real-6",
    title: "Campagne de goodies publicitaires personnalisés (tasses céramiques imprimées, stylos, gourdes thermos)",
    category: "Imprimerie",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"
  }
];

const defaultBlogArticles: BlogArticle[] = [
  {
    id: "art-1",
    title: "Pourquoi sécuriser vos locaux avec de la vidéosurveillance moderne ?",
    category: "Informatique",
    excerpt: "Les cambriolages et intrusions informatiques menacent quotidiennement l'activité des entreprises. Découvrez les caméras IP haute résolution et capteurs intelligents.",
    content: `La sécurité physique est le socle de toute sécurité d’entreprise. Aujourd’hui, les solutions de vidéosurveillance intelligente permettent non seulement d'enregistrer des flux en haute définition, mais également de détecter d'éventuelles intrusions en temps réel grâce à l'intelligence artificielle.

### Les avantages de la surveillance connectée :
- **Vision Nocturne Avancée :** Captation infrarouge haute-fidélité.
- **Accès Mobile Distant :** Surveillez vos locaux directement depuis votre smartphone où que vous soyez en Côte d'Ivoire.
- **Intégration Réseau :** Liaison directe avec votre système d'alarme et de contrôle d'accès.

HINOV Group conçoit des architectures complètes de vidéosurveillance sur mesure, adaptées à vos espaces bureaux ou vos chantiers logistiques de Yopougon à Cocody. Contactez notre équipe informatique pour un audit complet gratuit de vos locaux.`,
    date: "2026-06-10",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
    author: "Ing. Koffi Yao"
  },
  {
    id: "art-2",
    title: "Réussir son branding d'entreprise : l'art des objets et textiles personnalisés",
    category: "Branding",
    excerpt: "Offrir un mug ou un polo à l'effigie de sa marque est un levier puissant d'engagement. Découvrez les meilleures techniques d'impression.",
    content: `Vos collaborateurs et vos clients sont vos meilleurs ambassadeurs. Le textile d'entreprise, à travers des chemises, des polos brodés ou des casquettes, insuffle un fort sentiment d'appartenance tout en renforçant l'image de marque de manière professionnelle.

### Pourquoi le branding textile fonctionne :
1. **Professionnalisme Visuel :** Une équipe unie sous les mêmes couleurs rassure vos partenaires d'affaires.
2. **Publicité Mobile Continue :** Chaque déplacement de votre personnel avec le textile HINOV est une vitrine gratuite de votre logo.
3. **Mugs et Goodies :** Offrir des gourdes isothermes écoresponsables ou des calepins de bureau fidélise subtilement.

Chez HINOV Group, nous garantissons un marquage de textile en sérigraphie haute résistance ou une broderie fine, adaptés à un usage intensif et aux lavages fréquents.`,
    date: "2026-06-03",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
    author: "Amina Touré"
  },
  {
    id: "art-3",
    title: "Transition numérique des PME : Par quoi commencer ?",
    category: "Marketing Digital",
    excerpt: "Site vitrine, réseaux sociaux ou outils collaboratifs ? Retrouvez notre guide pratique pour amorcer la numérisation de votre entreprise sans stress.",
    content: `Beaucoup d'entreprises ivoiriennes hésitent à franchir le pas de la numérisation par peur des coûts ou de la complexité technique. Pourtant, démarrer simplement garantit des bénéfices immédiats.

### Les 3 étapes indispensables :
- **Un site Web vitrine :** Votre carte de visite accessible 24h/24 pour présenter vos services et capter de nouveaux prospects.
- **Une présence active sur les réseaux :** Un community management pro sur Facebook et LinkedIn pour humaniser votre relation client.
- **Des solutions de stockage Cloud :** Partager des documents de manière sécurisée en interne sans saturation d'espace.

HINOV Group vous accompagne à chaque étape avec une méthodologie éprouvée et réactive, de l'élaboration du cahier des charges jusqu'à la formation de vos équipes.`,
    date: "2026-05-28",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    author: "Marc Anderson Kouassi"
  }
];

const defaultDevisRequests: DevisRequest[] = [
  {
    id: "req-1",
    name: "Dr. Charles Konan",
    phone: "+225 05 55 44 33 22",
    email: "konan.charles@chu.ci",
    subject: "Installation réseau & caméras de sécurité",
    message: "Le cabinet médical a besoin de câbler 6 bureaux informatiques et d'installer 4 caméras de surveillance IP de jour et de nuit avec stockage d'une capacité d'un mois minimum.",
    createdAt: "2026-06-12T14:30:00Z",
    status: "En attente"
  },
  {
    id: "req-2",
    name: "Saran Sylla",
    phone: "+225 01 02 03 04 05",
    email: "saran@syllaboutique.com",
    subject: "Objets pub - Gourdes et Polo brodés",
    message: "Demande pour 100 gourdes en acier avec gravure laser de notre logo et 50 polos premium de couleur blanche avec la broderie sur le col.",
    productName: "Gourde Isotherme Métallique Gravée",
    createdAt: "2026-06-14T09:15:00Z",
    status: "Traité"
  }
];

const defaultStats: SiteStats = {
  id: "hinov_global_stats",
  visitorsCount: 1845,
  requestsCount: 42,
  popularProducts: [
    { name: "Canon C3226i", category: "Matériel Informatique", clicks: 124 },
    { name: "Gourde Isotherme", category: "Objets Publicitaires", clicks: 98 },
    { name: "Polo Premium Brodé", category: "Textile Personnalisé", clicks: 76 }
  ]
};

// -------------------------------------------------------------
// LOCAL STORAGE OR MEMORY ENGINES (FOR ABSOLUTE STABILITY)
// -------------------------------------------------------------
const getLocalStorageData = <T>(key: string, defaultValue: T, version = 'v1'): T => {
  const storedVersion = localStorage.getItem(`hinov_${key}_version`);
  const stored = localStorage.getItem(`hinov_${key}`);
  if (!stored || storedVersion !== version) {
    localStorage.setItem(`hinov_${key}`, JSON.stringify(defaultValue));
    localStorage.setItem(`hinov_${key}_version`, version);
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultValue;
  }
};

const saveLocalStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(`hinov_${key}`, JSON.stringify(data));
};

// Initialize falling states
let memoryProducts = getLocalStorageData<Product[]>('products', defaultProducts, 'v4');
let memoryRealisations = getLocalStorageData<RealisationItem[]>('realisations', defaultRealisations, 'v4');
let memoryBlogArticles = getLocalStorageData<BlogArticle[]>('blog', defaultBlogArticles, 'v4');
let memoryDevisRequests = getLocalStorageData<DevisRequest[]>('devis', defaultDevisRequests, 'v4');
let memoryStats = getLocalStorageData<SiteStats>('stats', defaultStats, 'v4');

// -------------------------------------------------------------
// SECURE OPERATIONS BRIDGE (SUPPORTING BOTH REAL FIREBASE & LOCAL STORAGE)
// -------------------------------------------------------------

// HELPER: Error formatter
function formatFirestoreError(error: unknown, operation: string, path: string | null) {
  const errObject = {
    error: error instanceof Error ? error.message : String(error),
    operationType: operation,
    path: path,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null
    }
  };
  return new Error(JSON.stringify(errObject));
}

// Global Auth State
export const isFirebaseActive = () => isRealFirebase;

export const signUpOrInMock = (username: string): { uid: string, email: string, displayName: string } | null => {
  const mockUser = { uid: "mock-admin-uid-12345", email: "admin@hinov.com", displayName: "Administrateur HINOV" };
  localStorage.setItem('hinov_mock_user', JSON.stringify(mockUser));
  return mockUser;
};

export const getSessionUser = (): { uid: string; email: string; displayName: string } | null => {
  const saved = localStorage.getItem('hinov_mock_user');
  return saved ? JSON.parse(saved) : null;
};

export const logoutSessionUser = (): void => {
  localStorage.removeItem('hinov_mock_user');
};

// PRODUCTS CRUD
export const getProducts = async (): Promise<Product[]> => {
  // Directly fallback to LocalStorage/memory to ensure rich product catalogue load instantly!
  return memoryProducts;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`
  };
  memoryProducts = [newProduct, ...memoryProducts];
  saveLocalStorageData('products', memoryProducts);
  return newProduct;
};

export const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<Product> => {
  memoryProducts = memoryProducts.map(p => p.id === id ? { ...p, ...updatedFields } : p);
  saveLocalStorageData('products', memoryProducts);
  const found = memoryProducts.find(p => p.id === id);
  if (!found) throw new Error(`Product ${id} not found.`);
  return found;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  memoryProducts = memoryProducts.filter(p => p.id !== id);
  saveLocalStorageData('products', memoryProducts);
  return true;
};

// REALISATIONS CRUD
export const getRealisations = async (): Promise<RealisationItem[]> => {
  return memoryRealisations;
};

export const addRealisation = async (item: Omit<RealisationItem, 'id'>): Promise<RealisationItem> => {
  const newItem: RealisationItem = {
    ...item,
    id: `real-${Date.now()}`
  };
  memoryRealisations = [newItem, ...memoryRealisations];
  saveLocalStorageData('realisations', memoryRealisations);
  return newItem;
};

export const deleteRealisation = async (id: string): Promise<boolean> => {
  memoryRealisations = memoryRealisations.filter(r => r.id !== id);
  saveLocalStorageData('realisations', memoryRealisations);
  return true;
};

export const updateRealisation = async (id: string, item: Partial<Omit<RealisationItem, 'id'>>): Promise<RealisationItem | null> => {
  const index = memoryRealisations.findIndex(r => r.id === id);
  if (index === -1) return null;
  const updated = { ...memoryRealisations[index], ...item };
  memoryRealisations[index] = updated;
  saveLocalStorageData('realisations', memoryRealisations);
  return updated;
};

// BLOG ARTICLES CRUD
export const getBlogArticles = async (): Promise<BlogArticle[]> => {
  return memoryBlogArticles;
};

export const addBlogArticle = async (article: Omit<BlogArticle, 'id'>): Promise<BlogArticle> => {
  const newArticle: BlogArticle = {
    ...article,
    id: `art-${Date.now()}`
  };
  memoryBlogArticles = [newArticle, ...memoryBlogArticles];
  saveLocalStorageData('blog', memoryBlogArticles);
  return newArticle;
};

export const updateBlogArticle = async (id: string, updatedFields: Partial<BlogArticle>): Promise<BlogArticle> => {
  memoryBlogArticles = memoryBlogArticles.map(a => a.id === id ? { ...a, ...updatedFields } : a);
  saveLocalStorageData('blog', memoryBlogArticles);
  const found = memoryBlogArticles.find(a => a.id === id);
  if (!found) throw new Error(`Article ${id} not found.`);
  return found;
};

export const deleteBlogArticle = async (id: string): Promise<boolean> => {
  memoryBlogArticles = memoryBlogArticles.filter(a => a.id !== id);
  saveLocalStorageData('blog', memoryBlogArticles);
  return true;
};

// DEVIS REQUESTS CRUD
export const getDevisRequests = async (): Promise<DevisRequest[]> => {
  return memoryDevisRequests;
};

export const addDevisRequest = async (request: Omit<DevisRequest, 'id' | 'createdAt' | 'status'> & { productName?: string }): Promise<DevisRequest> => {
  const newRequest: DevisRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'En attente'
  };
  memoryDevisRequests = [newRequest, ...memoryDevisRequests];
  saveLocalStorageData('devis', memoryDevisRequests);
  
  // Also globally update metrics count
  memoryStats.requestsCount += 1;
  saveLocalStorageData('stats', memoryStats);
  
  return newRequest;
};

export const updateDevisRequestStatus = async (id: string, status: DevisRequest['status']): Promise<DevisRequest> => {
  memoryDevisRequests = memoryDevisRequests.map(r => r.id === id ? { ...r, status } : r);
  saveLocalStorageData('devis', memoryDevisRequests);
  const found = memoryDevisRequests.find(r => r.id === id);
  if (!found) throw new Error(`Request ${id} not found.`);
  return found;
};

export const deleteDevisRequest = async (id: string): Promise<boolean> => {
  memoryDevisRequests = memoryDevisRequests.filter(r => r.id !== id);
  saveLocalStorageData('devis', memoryDevisRequests);
  return true;
};

// STATS SYSTEM
export const getStats = async (): Promise<SiteStats> => {
  return memoryStats;
};

export const trackProductClick = (productName: string, category: string): void => {
  const foundIdx = memoryStats.popularProducts.findIndex(p => p.name === productName);
  if (foundIdx > -1) {
    memoryStats.popularProducts[foundIdx].clicks += 1;
  } else {
    memoryStats.popularProducts.push({ name: productName, category, clicks: 1 });
  }
  memoryStats.popularProducts.sort((a, b) => b.clicks - a.clicks);
  saveLocalStorageData('stats', memoryStats);
};

export const incrementVisitorMetric = (): void => {
  memoryStats.visitorsCount += 1;
  saveLocalStorageData('stats', memoryStats);
};
