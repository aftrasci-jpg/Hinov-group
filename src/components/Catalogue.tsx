import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, MessageSquare, Tag, ArrowRight, Sparkles, Send, X, Check } from 'lucide-react';
import { Product } from '../types';
import { getProducts, addDevisRequest, trackProductClick } from '../supabase';
import FeaturedSlider from './FeaturedSlider';

interface CatalogueProps {
  initialCategoryFilter?: string | null;
  onSuccessMessage: (msg: string) => void;
}

const CATEGORIES = [
  "Tous nos rayons",
  "Matériel Informatique",
  "Fournitures de Bureau",
  "Fournitures Scolaires",
  "Objets Publicitaires",
  "Textile Personnalisé",
  "Supports de Communication"
];

// Aesthetic banner images based on cat selection
const CATEGORY_BANNERS: Record<string, string> = {
  "Tous nos rayons": "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=1200",
  "Matériel Informatique": "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1200",
  "Fournitures de Bureau": "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=1200",
  "Fournitures Scolaires": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
  "Objets Publicitaires": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
  "Textile Personnalisé": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200",
  "Supports de Communication": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
};

export default function Catalogue({ initialCategoryFilter, onSuccessMessage }: CatalogueProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous nos rayons");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Quick request state
  const [isRequesting, setIsRequesting] = useState<Product | null>(null);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  // Sync initialCategoryFilter when changed externally (from navbar)
  useEffect(() => {
    if (initialCategoryFilter) {
      // Find category that is included
      const matched = CATEGORIES.find(c => initialCategoryFilter.includes(c));
      if (matched) {
        setSelectedCategory(matched);
      }
    }
  }, [initialCategoryFilter]);

  // Load products from DB
  const loadProducts = async () => {
    const list = await getProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleWhatsAppRedirect = (product: Product) => {
    // Audit search metric
    trackProductClick(product.name, product.category);
    
    const phoneNumber = "2250759813511";
    const baseMessage = `Bonjour HINOV Group, je suis intéressé par le produit/service [${product.name}] vu sur votre site. Pourriez-vous m'envoyer un devis ou davantage d'informations ?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
    window.open(url, '_blank');
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRequesting) return;
    
    setSubmitting(true);
    try {
      await addDevisRequest({
        name: quoteForm.name,
        phone: quoteForm.phone,
        email: quoteForm.email,
        subject: `Demande de Devis - ${isRequesting.name}`,
        message: quoteForm.message || `Demande de cotation rapide pour ${isRequesting.name}. ${isRequesting.description}`,
        productName: isRequesting.name
      });
      
      onSuccessMessage(`Votre demande de devis pour "${isRequesting.name}" a été enregistrée avec succès. Notre équipe vous contactera sous peu !`);
      setQuoteForm({ name: '', email: '', phone: '', message: '' });
      setIsRequesting(null);
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter products pipeline
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "Tous nos rayons" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPopular = !showPopularOnly || p.isPopular === true;
    return matchesCategory && matchesSearch && matchesPopular;
  });

  return (
    <div id="hinov-catalogue-page" className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aesthetic Banner section */}
        <div id="catalogue-banner" className="relative rounded-3xl overflow-hidden h-60 mb-10 shadow-lg">
          <img 
            src={CATEGORY_BANNERS[selectedCategory] || CATEGORY_BANNERS["Tous nos rayons"]} 
            alt="Catalogue Hinov banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col justify-center px-8 md:px-16 text-white space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#F29A1A] font-bold uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full w-max">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rayons HINOV Group</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {selectedCategory === "Tous nos rayons" ? "Notre Catalogue Numérique" : selectedCategory}
            </h2>
            <p className="text-xs md:text-sm text-gray-300 font-light max-w-xl">
              Spécifiez vos filtres, parcourez nos fournitures de bureau, scolaires et matériels IT de marque, puis cliquez pour obtenir une offre personnalisée.
            </p>
          </div>
        </div>

        {/* Featured Products Slider */}
        {(() => {
          const featured = products.filter(p => p.isPopular);
          if (featured.length === 0) return null;
          return (
            <FeaturedSlider
              products={featured}
              onRequestDevis={(product) => { trackProductClick(product.name, product.category); setIsRequesting(product); }}
            />
          );
        })()}

        {/* Searching & filters row */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
          
          {/* Search box built elegantly */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher un matériel, outil ou article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all"
            />
          </div>

          {/* Quick select category pills scrolling list */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end w-full lg:w-auto">
            <label className="inline-flex items-center space-x-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-semibold text-gray-700 transition-all select-none">
              <input 
                type="checkbox" 
                checked={showPopularOnly}
                onChange={(e) => setShowPopularOnly(e.target.checked)}
                className="rounded border-gray-300 text-[#F29A1A] focus:ring-[#F29A1A] w-4 h-4 cursor-pointer"
              />
              <span>🔥 Populaires</span>
            </label>
            <button 
              onClick={() => { setSelectedCategory("Tous nos rayons"); setSearchQuery(""); setShowPopularOnly(false); }}
              className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 border border-slate-200 rounded-xl cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>

        </div>

        {/* Categories Tab selector bar */}
        <div id="catalog-category-scroller" className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); }}
                className={`cursor-pointer shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  isActive 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic products list grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-1">Aucun produit trouvé</h3>
            <p className="text-gray-500 text-xs font-light px-4">
              Nous n'avons aucun matériel correspondant exactement à vos filtres actuels. Modifiez vos termes de recherche ou sélectionnez une autre catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                id={`product-card-${product.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-[460px]"
              >
                {/* Product Image Box */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Popular and Category Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                    <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md shadow-sm">
                      {product.category}
                    </span>
                    {product.isPopular && (
                      <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F29A1A] to-amber-500 flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-white fill-white" />
                        Populaire
                      </span>
                    )}
                  </div>
                </div>

                {/* Information Box */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-[#111111] group-hover:text-[#4A93D1] transition-colors leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 font-normal leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action bottom bundle */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3 mt-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">TARIFICATION</span>
                      <span className="text-xs font-extrabold text-[#4CD37E] bg-[#4CD37E]/10 rounded-lg px-2.5 py-1">
                        {product.price || "Sur devis"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleWhatsAppRedirect(product)}
                        className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 focus:outline-none"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => { trackProductClick(product.name, product.category); setIsRequesting(product); }}
                        className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl py-2.5 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Devis Facile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* QUICK DEVIS DIALOG/POPUP */}
      {isRequesting && (
        <div id="quick-devis-modal-overlay" className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[150] px-4">
          <div id="quick-devis-modal" className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Header segment logo colored */}
            <div className="bg-slate-950 text-white px-6 py-5 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Demande de Devis Rapide</h3>
                  <p className="text-[10px] text-gray-400">HINOV Group Pro-Suite</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRequesting(null)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target product context */}
            <div className="bg-slate-50 border-b border-gray-100 p-5 flex items-center space-x-4">
              <img src={isRequesting.imageUrl} alt="" className="w-16 h-12 object-cover rounded-lg border" />
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{isRequesting.category}</p>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">{isRequesting.name}</h4>
              </div>
            </div>

            {/* Quote Request Form */}
            <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Nom Complet *</label>
                  <input 
                    type="text" 
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                    placeholder="Ex: Jean Paul Kouadio" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Téléphone *</label>
                  <input 
                    type="tel" 
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                    placeholder="Ex: +225 07..." 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Adresse Email *</label>
                <input 
                  type="email" 
                  required
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                  placeholder="Ex: jean@entreprise.com" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Message (Spécifications, quantités...) *</label>
                <textarea 
                  rows={3}
                  required
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                  placeholder={`Quantités souhaitées, caractéristiques particulières ou instructions de livraison pour ${isRequesting.name}...`}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl py-3.5 text-xs font-bold transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
              >
                {submitting ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer ma demande de cotation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
