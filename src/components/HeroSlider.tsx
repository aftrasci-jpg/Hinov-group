import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Terminal, Network, ShoppingBag, Stamp } from 'lucide-react';

interface HeroSliderProps {
  setCurrentTab: (tab: string) => void;
}

export default function HeroSlider({ setCurrentTab }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      title: "Solutions Informatiques Professionnelles",
      description: "Maintenance, déploiements de réseaux stables, vidéosurveillance IP de pointe et équipements performants.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600",
      colorClass: "from-[#4A93D1]/80 to-[#111111]",
      theme: "#4A93D1",
      icon: Network,
      ctaText: "Demander un devis",
      ctaTab: "contact"
    },
    {
      title: "Développez votre présence digitale",
      description: "Développement de sites web vitrines et marchands, conception d'applications web d'entreprise et marketing d'influence.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
      colorClass: "from-[#C83AB3]/80 to-[#111111]",
      theme: "#C83AB3",
      icon: Terminal,
      ctaText: "Voir nos services",
      ctaTab: "apropos"
    },
    {
      title: "Votre partenaire en imprimerie & fournitures",
      description: "Impression numérique et offset haut de gamme, fournitures scolaires pour établissements et fournitures pour votre bureautique.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1600",
      colorClass: "from-[#F29A1A]/80 to-[#111111]",
      theme: "#F29A1A",
      icon: ShoppingBag,
      ctaText: "Voir le catalogue",
      ctaTab: "catalogue"
    },
    {
      title: "Donnez une visibilité forte à votre marque",
      description: "Marquage textile haut de gamme, sérigraphie sur goodies et objets publicitaires, et marquage publicitaire de votre flotte automobile.",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1600",
      colorClass: "from-[#4CD37E]/80 to-[#111111]",
      theme: "#4CD37E",
      icon: Stamp,
      ctaText: "Obtenir un devis",
      ctaTab: "contact"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div id="hinov-hero-slider" className="relative h-[550px] lg:h-[650px] w-full overflow-hidden bg-[#111111]">
      
      {/* Slide Images */}
      {slides.map((slide, index) => {
        const Icon = slide.icon;
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-x-0 w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms]"
              style={{ transform: isActive ? 'scale(1)' : 'scale(1.05)' }}
            />
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.colorClass} opacity-85`} />

            {/* Content Container */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center z-20">
              <div className="max-w-2xl text-left text-white space-y-6">
                
                {/* Sector Badge */}
                <div 
                  className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-sm"
                  style={{ color: slide.theme }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#FFFFFF]">HINOV Excellence</span>
                </div>

                {/* Main Heading styled with space & typography */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  {slide.title}
                </h1>

                {/* Subtitle description */}
                <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-2 leading-relaxed max-w-xl font-normal">
                  {slide.description}
                </p>

                {/* Buttons block */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => setCurrentTab(slide.ctaTab)}
                    className="cursor-pointer transition-all duration-300 text-sm font-bold px-6 py-3.5 rounded-xl text-white shadow-lg shadow-black/30 hover:scale-[1.02] flex items-center space-x-2"
                    style={{ backgroundColor: slide.theme }}
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('catalogue')}
                    className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all duration-300 text-sm font-semibold px-6 py-3.5 rounded-xl text-white hover:scale-[1.02]"
                  >
                    Explorer nos produits
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Buttons Arrow */}
      <button
        id="hero-slider-prev-btn"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#111111]/30 hover:bg-[#111111]/70 text-white backdrop-blur-sm transition-colors border border-white/10 cursor-pointer hidden md:block"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        id="hero-slider-next-btn"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#111111]/30 hover:bg-[#111111]/70 text-white backdrop-blur-sm transition-colors border border-white/10 cursor-pointer hidden md:block"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Control Dots Selector */}
      <div id="hero-slider-dot-indicators" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3 bg-black/20 px-4 py-2.5 rounded-full backdrop-blur-sm">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === current ? 'w-8' : 'hover:bg-white/50'
            }`}
            style={{ backgroundColor: index === current ? slides[index].theme : 'rgba(255, 255, 255, 0.4)' }}
            title={`Slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
