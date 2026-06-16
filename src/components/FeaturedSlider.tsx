import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';
import { Product } from '../types';

interface FeaturedSliderProps {
  products: Product[];
  onRequestDevis: (product: Product) => void;
}

export default function FeaturedSlider({ products, onRequestDevis }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setVisibleCount(3);
      else if (window.innerWidth >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount]);

  const maxIndex = Math.max(0, products.length - visibleCount);

  const next = useCallback(() => {
    setCurrentIndex(i => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex(i => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || products.length <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next, products.length, visibleCount]);

  if (products.length === 0) return null;

  const translateX = -(currentIndex * (100 / visibleCount));
  const showControls = products.length > visibleCount;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F29A1A] to-amber-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm leading-tight">Produits Vedettes</h3>
            <p className="text-[10px] text-gray-400 font-light">Sélection mise en avant par notre équipe</p>
          </div>
        </div>

        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prev}
              className="cursor-pointer w-8 h-8 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={next}
              className="cursor-pointer w-8 h-8 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{ minWidth: `${100 / visibleCount}%`, width: `${100 / visibleCount}%` }}
              className="px-2"
            >
              <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-64">
                <div className="relative h-36 overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 text-[9px] font-bold text-white bg-slate-900/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="absolute top-3 right-3 text-[9px] font-bold text-white bg-gradient-to-r from-[#F29A1A] to-amber-500 px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Vedette
                  </span>
                </div>
                <div className="p-3 flex flex-col flex-grow justify-between">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight group-hover:text-[#4A93D1] transition-colors">
                    {product.name}
                  </h4>
                  <button
                    onClick={() => onRequestDevis(product)}
                    className="cursor-pointer mt-2 w-full bg-[#4A93D1] hover:bg-[#4A93D1]/90 active:scale-95 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Demander un devis</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="flex justify-center space-x-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? 'bg-[#F29A1A] w-5' : 'bg-gray-300 w-1.5 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
