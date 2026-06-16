export interface Product {
  id: string;
  name: string;
  category: string; // "Matériel Informatique", "Fournitures de Bureau", "Fournitures Scolaires", "Objets Publicitaires", "Textile Personnalisé", "Supports de Communication"
  description: string;
  price?: string; // "Sur devis" or actual currency
  imageUrl: string;
  isPopular?: boolean;
}

export interface RealisationItem {
  id: string;
  title: string;
  category: string; // "Réseaux & Informatique", "Création Web", "Imprimerie", "Branding Véhicules", "Textile Personnalisé"
  imageUrl: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string; // "Informatique", "Marketing Digital", "Imprimerie", "Branding", "Fournitures", "Réalisations HINOV"
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string;
  author: string;
}

export interface DevisRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  productName?: string; // If requested from a specific product
  createdAt: string;
  status: 'En attente' | 'Accepté' | 'Refusé' | 'Traité';
}

export interface SiteStats {
  id: string;
  visitorsCount: number;
  requestsCount: number;
  popularProducts: { name: string; category: string; clicks: number }[];
}

export interface HeroSlideContent {
  title: string;
  description: string;
  ctaText: string;
}

export interface SiteContent {
  hero: {
    slides: HeroSlideContent[];
  };
  contact: {
    address: string;
    phone1: string;
    phone2: string;
    email: string;
    whatsapp: string;
  };
  about: {
    tagline: string;
    intro: string;
    mission: string;
    vision: string;
  };
}
