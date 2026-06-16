import React, { useState, useEffect } from 'react';
import { Layers, Image as ImageIcon, Eye, X, Filter } from 'lucide-react';
import { RealisationItem } from '../types';
import { getRealisations } from '../firebase';

const CATEGORIES = [
  "Tous",
  "Réseaux & Informatique",
  "Création Web",
  "Imprimerie",
  "Branding Véhicules",
  "Textile Personnalisé"
];

export default function Gallery() {
  const [items, setItems] = useState<RealisationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [zoomItem, setZoomItem] = useState<RealisationItem | null>(null);

  const loadRealisations = async () => {
    const list = await getRealisations();
    setItems(list);
  };

  useEffect(() => {
    loadRealisations();
  }, []);

  const filteredItems = items.filter(item => 
    selectedFilter === "Tous" || item.category === selectedFilter
  );

  return (
    <div id="hinov-realisations-gallery" className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Intro header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111111]/5 text-slate-800 text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galerie HINOV</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Nos Dernières Réalisations
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Découvrez en images les déploiements réseaux, les habillages logistiques, les impressions de supports de communication et les équipements textiles sur mesure accomplis par les équipes de HINOV Group.
          </p>
        </div>

        {/* Filter categories buttons bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 text-[10px] uppercase font-bold text-slate-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtres</span>
          </div>
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedFilter;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`cursor-pointer px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-[#4A93D1] text-white shadow-md shadow-[#4A93D1]/20' 
                    : 'bg-slate-50 text-gray-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Aucune photo dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 border border-gray-100 shadow-sm cursor-pointer"
                onClick={() => setZoomItem(item)}
              >
                {/* Background image */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Cover Overlay holding labels */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

                {/* Slide Up Content Panel on hovering */}
                <div className="absolute inset-x-0 bottom-0 translate-y-6 group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end p-6 text-white z-20">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#F29A1A] mb-1 scale-90 origin-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-extrabold tracking-tight mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-grat-300 font-bold hover:text-[#4A93D1] transition-colors w-max scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Eye className="w-4 h-4 text-[#4A93D1]" />
                    <span>Agrandir la photo</span>
                  </div>
                </div>

                {/* Lens focus aesthetic tag */}
                <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-xl p-2 z-10 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULL ZOOM INTERACTIVE MODAL */}
      {zoomItem && (
        <div id="gallery-zoom-backdrop" className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[200] p-4" onClick={() => setZoomItem(null)}>
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button 
              onClick={() => setZoomItem(null)}
              className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white border border-white/10 p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scaled Image */}
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              <img 
                src={zoomItem.imageUrl} 
                alt={zoomItem.title} 
                className="max-h-[70vh] object-contain w-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Caption panel */}
            <div className="p-6 bg-slate-950 border-t border-slate-900 text-left space-y-1">
              <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-[#F29A1A]">
                {zoomItem.category}
              </span>
              <h4 className="text-white font-extrabold text-base md:text-lg tracking-tight">
                {zoomItem.title}
              </h4>
              <p className="text-xs text-gray-400 font-light">
                HINOV Group &copy; Travaux et réalisations de communication certifiés professionnels en Côte d'Ivoire.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
