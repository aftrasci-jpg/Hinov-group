import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, BookOpen, X, Clock, HelpCircle } from 'lucide-react';
import { BlogArticle } from '../types';
import { getBlogArticles } from '../firebase';

const BLOG_CATEGORIES = [
  "Tous",
  "Informatique",
  "Marketing Digital",
  "Imprimerie",
  "Branding",
  "Fournitures",
  "Réalisations HINOV"
];

export default function Blog() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [readingArticle, setReadingArticle] = useState<BlogArticle | null>(null);

  const loadArticles = async () => {
    const list = await getBlogArticles();
    setArticles(list);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const filteredArticles = articles.filter(a => 
    selectedCategory === "Tous" || a.category === selectedCategory
  );

  return (
    <div id="hinov-blog-section" className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111111]/5 text-slate-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog & Actualités</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Le Mag d’HINOV Group
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Astuces, guides de sécurité informatique, secrets de communication imprimée et conseils d'équipement pour optimiser la performance et la visibilité de votre entreprise.
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-[#4A93D1] text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles List Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border max-w-sm mx-auto">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun article dans cette rubrique.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                id={`blog-card-${article.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[480px]"
              >
                {/* Photo box */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Text Content block */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{article.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{article.author}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-[#111111] group-hover:text-[#4A93D1] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-500 font-normal leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Read More button */}
                  <div className="pt-4 border-t border-gray-50 mt-auto flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>3 min de lecture</span>
                    </span>
                    <button
                      onClick={() => setReadingArticle(article)}
                      className="cursor-pointer font-bold text-xs text-[#4A93D1] group-hover:text-[#4A93D1]/80 transition-colors flex items-center space-x-1"
                    >
                      <span>Lire l'article</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* DETAILED ARTICLE READER OVERLAY DRAWER */}
      {readingArticle && (
        <div id="blog-reader-backdrop" className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={() => setReadingArticle(null)}>
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Nav Close button */}
            <button 
              onClick={() => setReadingArticle(null)}
              className="absolute top-4 right-4 z-50 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl border border-white/15 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto w-full">
              
              {/* Cover Banner */}
              <div className="relative h-64 md:h-80 bg-slate-900">
                <img 
                  src={readingArticle.imageUrl} 
                  alt={readingArticle.title} 
                  className="w-full h-full object-cover brightness-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="text-[10px] font-bold text-white px-3.5 py-1.5 rounded-full bg-[#4A93D1]">
                    {readingArticle.category}
                  </span>
                  <h3 className="text-xl md:text-3xl font-extrabold tracking-tight mt-1">
                    {readingArticle.title}
                  </h3>
                </div>
              </div>

              {/* Meta stats and Article Body content formatted */}
              <div className="p-8 space-y-6">
                
                {/* Meta block */}
                <div className="flex flex-wrap gap-4 items-center text-xs text-gray-500 font-semibold border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Auteur : {readingArticle.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Publié le {readingArticle.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Séance informative d'HINOV Group</span>
                  </div>
                </div>

                {/* Content text */}
                <div className="text-slate-800 leading-relaxed text-sm whitespace-pre-line space-y-4 font-normal">
                  {readingArticle.content}
                </div>

                {/* Footer disclaimer */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start space-x-3.5 text-xs text-slate-500 font-medium">
                  <BookOpen className="w-5 h-5 text-[#4A93D1] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-800 block mb-0.5">Besoin d'aller plus loin ?</span>
                    HINOV Group vous propose de réaliser des audits complets ou des conseils personnalisés pour la mise en œuvre de ces solutions au sein de votre structure. Prenez contact avec nos conseillers techniques.
                  </div>
                </div>

                {/* Closing action button */}
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setReadingArticle(null)}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    Fermer la lecture
                  </button>
                </div>

              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
