import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSlider from './components/HeroSlider';
import Catalogue from './components/Catalogue';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Apropos from './components/Apropos';
import AdminDashboard from './components/AdminDashboard';

// DB getters & types
import { Product, RealisationItem } from './types';
import { getProducts, getRealisations, trackProductClick } from './supabase';

import { 
  Network, Printer, Shirt, BookOpen, ChevronRight, 
  Sparkles, CheckCircle, PhoneCall, Gift, Heart, ArrowRight, ShieldCheck, 
  Award, MessageSquare, ClipboardCheck, X 
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('accueil');
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [recentRealisations, setRecentRealisations] = useState<RealisationItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load lobby specific elements
  useEffect(() => {
    const fetchLobbyDb = async () => {
      try {
        const [prods, reals] = await Promise.all([
          getProducts(),
          getRealisations()
        ]);
        // filter popular ones
        setPopularProducts(prods.filter(p => p.isPopular).slice(0, 3));
        setRecentRealisations(reals.slice(0, 4));
      } catch (e) {
        console.error("Lobby load failed", e);
      }
    };
    fetchLobbyDb();
  }, [currentTab]);

  // Floating notifications triggers
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => curr === msg ? null : curr);
    }, 8000);
  };

  const handleWhatsAppFloatClick = () => {
    const phoneNumber = "2250759813511";
    const msg = "Bonjour HINOV Group, j'aimerais obtenir des conseils ou une tarification pour un projet au sein de notre entreprise.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Helper mapping: resolves tab prefixes for subcategory navigation
  let resolvedTab = currentTab;
  let categoryFilterSpec: string | null = null;
  if (currentTab.startsWith('catalogue-')) {
    resolvedTab = 'catalogue';
    categoryFilterSpec = currentTab.replace('catalogue-', '');
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-[#4A93D1]/20 selection:text-[#4A93D1]">
      
      {/* 1. Navbar */}
      <Navbar 
        currentTab={resolvedTab} 
        setCurrentTab={setCurrentTab}
        onAdminClick={() => setCurrentTab('admin')} 
      />

      {/* 2. Main content router */}
      <main className="flex-grow">
        
        {/* TAB 1: ACCUEIL / LOBBY */}
        {resolvedTab === 'accueil' && (
          <div className="space-y-16 pb-12 animate-fade-in">
            {/* Sliding covers hero banner */}
            <HeroSlider setCurrentTab={setCurrentTab} />

            {/* Core Pillars business showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4A93D1]/10 text-[#4A93D1] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nos 4 Pôles d'Excellence</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Des solutions intégrées pour votre croissance
                </h2>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  HINOV Group concentre le meilleur savoir-faire technique en Côte d'Ivoire pour équiper, connecter et habiller votre marque avec précision.
                </p>
              </div>

              {/* Grid 4 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* Pillar 1: Informatique */}
                <div className="group bg-white rounded-3xl border border-slate-100 hover:border-[#4A93D1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"
                      alt="Solutions réseaux & Informatique"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A93D1]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-[#4A93D1] shadow">
                      <Network className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-[#4A93D1] transition-colors">
                        Solutions réseaux & Informatique
                      </h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Câblage de bureaux, pare-feu de protection, caméra de sécurité IP intelligente et vente d'ordinateurs ou serveurs Dell/HP.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentTab('catalogue-Matériel Informatique')}
                      className="cursor-pointer text-xs font-extrabold text-[#4A93D1] inline-flex items-center space-x-1 hover:space-x-2 transition-all w-max"
                    >
                      <span>Découvrir le matériel</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pillar 2: Imprimerie offset/numerique */}
                <div className="group bg-white rounded-3xl border border-slate-100 hover:border-[#F29A1A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600"
                      alt="Imprimerie & Supports de communication"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F29A1A]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-[#F29A1A] shadow">
                      <Printer className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-[#F29A1A] transition-colors">
                        Imprimerie & Supports de com
                      </h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Bâches géantes promotionnelles, vinyles autocollants de vitrine, kakemonos légers et impression offset de revues de luxe.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentTab('catalogue-Supports de Communication')}
                      className="cursor-pointer text-xs font-extrabold text-[#F29A1A] inline-flex items-center space-x-1 hover:space-x-2 transition-all w-max"
                    >
                      <span>Voir nos impressions</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pillar 3: Textiles et objets */}
                <div className="group bg-white rounded-3xl border border-slate-100 hover:border-[#C83AB3] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600"
                      alt="Objets & Textiles personnalisés"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C83AB3]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-[#C83AB3] shadow">
                      <Shirt className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-[#C83AB3] transition-colors">
                        Objets & Textiles personnalisés
                      </h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Polos brodés de haute qualité, T-shirts sérigraphiés, impression mug de bureau, stylos personnalisés, gourdes et goodies.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentTab('catalogue-Textile Personnalisé')}
                      className="cursor-pointer text-xs font-extrabold text-[#C83AB3] inline-flex items-center space-x-1 hover:space-x-2 transition-all w-max"
                    >
                      <span>Catalogue textile</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pillar 4: Scolaires et bureau */}
                <div className="group bg-white rounded-3xl border border-slate-100 hover:border-[#4CD37E] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=600"
                      alt="Fournitures en gros scolaire/bureau"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4CD37E]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-[#4CD37E] shadow">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-[#4CD37E] transition-colors">
                        Fournitures en gros scolaire/bureau
                      </h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Distribution de ramettes de papier format A4, cahiers scolaires de marque, stylos complémentaires et consommables imprimantes.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentTab('catalogue-Fournitures Scolaires')}
                      className="cursor-pointer text-xs font-extrabold text-[#4CD37E] inline-flex items-center space-x-1 hover:space-x-2 transition-all w-max"
                    >
                      <span>Explorer l'offre</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* TRUST METRICS PARALLAX HERO BLOCK */}
            <section className="bg-slate-950 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Text statement */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="inline-flex items-center space-x-1.5 text-[#F29A1A] font-mono text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full w-max">
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>SÉCURITÉ ET CERTIFICATION</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                      Le choix de la rigueur professionnelle à Abidjan
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      Fini l'informel et les déceptions de livraison. HINOV Group s'engage formellement sur votre cahier des charges avec des procédures éprouvées en Côte-d'Ivoire.
                    </p>
                    <div className="pt-2">
                      <button 
                        onClick={() => setCurrentTab('apropos')}
                        className="cursor-pointer text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-5.5 py-3 rounded-xl border border-white/25 transition-all text-center flex items-center space-x-2"
                      >
                        <span>Découvrir notre histoire</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    <div className="bg-[#111111] p-6.5 rounded-2xl border border-slate-850 space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#4A93D1]/10 flex items-center justify-center text-[#4A93D1]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-xs">Présence Physique Réelle</h4>
                      <p className="text-[10px] text-gray-400 font-normal leading-relaxed">
                        Nos bureaux basés à Yopougon, Cité CIE, vous accueillent pour vérifier le matériel et valider vos maquettes textiles.
                      </p>
                    </div>

                    <div className="bg-[#111111] p-6.5 rounded-2xl border border-slate-850 space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#F29A1A]/10 flex items-center justify-center text-[#F29A1A]">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-xs">Suivi WhatsApp & Ligne</h4>
                      <p className="text-[10px] text-gray-400 font-normal leading-relaxed">
                        Un coordinateur dédié vous répond instantanément et vous transmet l'avancée de vos impressions en photo/vidéo.
                      </p>
                    </div>

                    <div className="bg-[#111111] p-6.5 rounded-2xl border border-slate-850 space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#4CD37E]/10 flex items-center justify-center text-[#4CD37E]">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-xs">Devis Clair en 24H</h4>
                      <p className="text-[10px] text-gray-400 font-normal leading-relaxed">
                        Tous nos tarifs scolaires et bureautiques de gros sont transparents et garantis sans surcoût caché à la livraison.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </section>

            {/* POPULAR PRODUCTS HOT-SELLERS SPOTLIGHT GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 pb-2 border-b border-gray-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#F29A1A] uppercase tracking-wider">MARQUAGES & IT DE MARQUE</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Nos Produits Vedettes les plus demandés
                  </h3>
                </div>
                <button 
                  onClick={() => setCurrentTab('catalogue')}
                  className="cursor-pointer text-xs font-bold text-[#4A93D1] hover:text-[#4A93D1]/80 flex items-center space-x-1.5 transition-colors shrink-0"
                >
                  <span>Explorer tout le catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {popularProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm flex flex-col justify-between h-[420px] group"
                  >
                    <div className="relative h-44 bg-slate-100">
                      <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                      <div className="absolute bottom-3 left-3 bg-slate-950/85 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                        {p.category}
                      </div>

                      {/* Hot popular tag */}
                      <span className="absolute top-3 right-3 bg-[#F29A1A] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full animate-pulse shadow-sm">
                        🔥 HOT-SELLER
                      </span>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-[#111111] text-base leading-tight truncate">{p.name}</h4>
                        <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-4">
                        <span className="text-xs font-extrabold text-[#4CD37E] bg-[#4CD37E]/8/10 px-2.5 py-1 rounded-lg">
                          Sur devis rapide
                        </span>
                        
                        <button 
                          onClick={() => {
                            trackProductClick(p.name, p.category);
                            // Set to catalogue direct
                            setCurrentTab(`catalogue-${p.category}`);
                          }}
                          className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <span>Commander</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* REAL PORTFOLIO RECENT PHOTO STRIP REEL */}
            <section className="bg-slate-50 py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 pb-2 border-b border-gray-100">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#4CD37E] uppercase tracking-wider">CONSTRUCTION, TEXTILE & WEB</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Nos Projets d'Équipe en Côte d'Ivoire
                  </h3>
                </div>
                <button 
                  onClick={() => setCurrentTab('realisations')}
                  className="cursor-pointer text-xs font-bold text-[#4CD37E] hover:text-[#4CD37E]/80 flex items-center space-x-1.5 transition-colors shrink-0"
                >
                  <span>Voir la galerie photo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recentRealisations.map((real) => (
                  <div 
                    key={real.id} 
                    onClick={() => setCurrentTab('realisations')}
                    className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200 border cursor-pointer group shadow-sm hover:shadow-md transition-all"
                  >
                    <img src={real.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[8px] font-extrabold uppercase text-[#F29A1A] leading-none mb-1">{real.category}</span>
                      <h4 className="text-[10px] sm:text-xs font-bold leading-tight truncate">{real.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: À PROPOS */}
        {resolvedTab === 'apropos' && <Apropos />}

        {/* TAB 3: CATALOGUE (with initial filter) */}
        {resolvedTab === 'catalogue' && (
          <Catalogue 
            initialCategoryFilter={categoryFilterSpec} 
            onSuccessMessage={triggerNotification}
          />
        )}

        {/* TAB 4: RÉALISATIONS GALLERY */}
        {resolvedTab === 'realisations' && <Gallery />}

        {/* TAB 5: BLOG MAG */}
        {resolvedTab === 'blog' && <Blog />}

        {/* TAB 6: CONTACT & QUOTES */}
        {resolvedTab === 'contact' && <Contact onSuccessMessage={triggerNotification} />}

        {/* TAB 7: ADMINISTRATIVE DASHBOARD CONSOLE */}
        {resolvedTab === 'admin' && (
          <AdminDashboard 
            onNotify={triggerNotification} 
            setCurrentTab={setCurrentTab}
          />
        )}

      </main>

      {/* 3. Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* 4. DYNAMIC ALERT NOTIFICATION FOR ACTIONS SUCCESS */}
      {notification && (
        <div 
          id="hinov-floating-alert" 
          className="fixed top-24 right-4 z-[200] max-w-sm w-full bg-white text-slate-900 border border-emerald-500/20 rounded-2xl shadow-xl shadow-[#111111]/10 p-5 p-r-10 animate-fade-in flex items-start space-x-3.5"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-grow space-y-1">
            <strong className="text-xs font-extrabold text-slate-900">Notification HINOV Group</strong>
            <p className="text-[11px] text-gray-500 leading-normal font-light">
              {notification}
            </p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. WHATSAPP DYNAMIC FLOATING WIDGET */}
      <div 
        id="hinov-whatsapp-floating-widget" 
        className="fixed bottom-6 right-6 z-[90] flex flex-col items-end space-y-2.5"
      >
        <div className="bg-slate-950/80 backdrop-blur-md text-white rounded-2xl p-3 border border-white/10 shadow-lg text-[10px] font-medium max-w-[200px] block leading-normal md:opacity-90 hover:opacity-100 transition-opacity">
          ⚡ <strong className="text-[#4CD37E]">Service Urgent 24h :</strong> Échangez en direct avec nos conseillers techniques !
        </div>
        
        <button
          onClick={handleWhatsAppFloatClick}
          className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all text-center flex items-center justify-center relative group"
          title="Discutez en direct sur WhatsApp avec HINOV Group"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -inset-1.5 rounded-full bg-emerald-400 animate-ping opacity-25" />
          <MessageSquare className="w-6.5 h-6.5 relative z-10 fill-white" />
        </button>
      </div>

    </div>
  );
}
