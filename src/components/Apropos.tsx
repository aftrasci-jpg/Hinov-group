import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Award, ArrowUpRight, Zap, RefreshCw, Send, CheckCircle, Quote, Users } from 'lucide-react';
import { DEFAULT_SITE_CONTENT } from '../supabase';
import { SiteContent } from '../types';

interface AproposProps {
  siteContent: SiteContent;
}

export default function Apropos({ siteContent }: AproposProps) {
  const about = siteContent?.about ?? DEFAULT_SITE_CONTENT.about;
  const VALUES = [
    { name: "Innovation", icon: Zap, color: "#4A93D1", desc: "Intégrer les dernières technologies informatiques pour propulser votre entreprise." },
    { name: "Excellence", icon: Award, color: "#F29A1A", desc: "Assurer un niveau de rendu professionnel et sans compromis sur chacun de nos livrables." },
    { name: "Réactivité", icon: RefreshCw, color: "#4CD37E", desc: "Intervenir rapidement pour la maintenance logicielle ou matérielle avec assistance continue." },
    { name: "Intégrité", icon: ShieldCheck, color: "#C83AB3", desc: "Établir des relations transparentes de confiance, du devis à la livraison chez vous." },
    { name: "Satisfaction Client", icon: Heart, color: "#111111", desc: "Accompagner chaque client de Yopougon à Cocody pour lui offrir le service parfait." }
  ];

  const COLLABORATION_STEPS = [
    { step: "1", title: "Prise de contact", desc: "Formulez vos besoins sur notre site, WhatsApp ou directement dans nos locaux." },
    { step: "2", title: "Analyse du besoin", desc: "Nos ingénieurs et infographistes évaluent votre cahier des charges technique." },
    { step: "3", title: "Élaboration du devis", desc: "Nous vous envoyons une offre de tarification personnalisée sous 24 heures." },
    { step: "4", title: "Validation", desc: "Ajustement et contractualisation officielle pour sceller le début des opérations." },
    { step: "5", title: "Réalisation", desc: "Déploiement réseau, infographie textile, impression bâche ou développement web." },
    { step: "6", title: "Livraison", desc: "Remise officielle de vos fournitures, ordinateurs ou supports publicitaires." },
    { step: "7", title: "Support après livraison", desc: "Assistance continue de nos équipes informatiques pour rassurer vos opérateurs." }
  ];

  const WHY_CHOOS_US = [
    "Expertise multisectorielle (De l'IT de pointe à la papeterie d'école)",
    "Accompagnement personnalisé étape par étape",
    "Solutions sur mesure adaptées aux PME de Côte-d'Ivoire",
    "Réactivité opérationnelle immédiate",
    "Respect strict des délais annoncés",
    "Qualité professionnelle garantie",
    "Assistance continue de nos conseillers"
  ];

  const TESTIMONIALS = [
    {
      quote: "HINOV Group a câblé l'intégralité de nos bureaux à la Cité CIE et installé notre parc de vidéosurveillance. Un professionnalisme rare avec une réactivité incroyable après livraison !",
      author: "M. Bakary Coulibaly",
      role: "Directeur Général, IvoirLogistique",
      avatar: "BC"
    },
    {
      quote: "Nous commandons toutes les ramettes de papier, fournitures complémentaires et polo personnalisés d'équipes pour nos rentrées scolaires chez HINOV. La qualité de la broderie de leur textile est impeccable !",
      author: "Mme Florence Yao",
      role: "Secrétaire d’Académie, Groupe Scolaire Horizon",
      avatar: "FY"
    }
  ];

  const CLIENTS_LOGOS = [
    { name: "CIE Abidjan", color: "from-blue-500 to-cyan-500" },
    { name: "Sotra Transit", color: "from-emerald-500 to-teal-500" },
    { name: "Anaré Côte d'Ivoire", color: "from-amber-500 to-orange-500" },
    { name: "Ivory Web Agency", color: "from-fuchsia-500 to-pink-500" },
    { name: "Yopougon Logistique", color: "from-slate-600 to-slate-800" }
  ];

  return (
    <div id="hinov-about-view" className="bg-white min-h-screen">
      
      {/* Corporate Intro Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text block left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111111]/5 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <span>Qui sommes-nous ?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              HINOV Group, votre partenaire de confiance multiservices.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              {about.intro}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Notre expertise s’articule autour de quatre pôles majeurs : 
              les <strong className="text-slate-900">solutions informatiques avancées</strong>, la <strong className="text-slate-900 font-semibold text-slate-900">communication digitale</strong> moderne, l’<strong className="text-slate-900">imprimerie professionnelle</strong> offset/numérique grand format, ainsi que la <strong className="text-slate-900">personnalisation d'objets, textiles publicitaires</strong> et la distribution de fournitures scolaires et de bureau de haute qualité.
            </p>
            <div className="pt-2">
              <span className="text-[#F29A1A] font-extrabold text-sm font-mono tracking-wide">
                {about.tagline}
              </span>
            </div>
          </div>

          {/* Graphical presentation box right */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#4A93D1]/5 rounded-full filter blur-xl" />
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4A93D1]/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#4A93D1]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Notre Mission</h3>
                    <p className="text-xs text-gray-500 mt-1 font-light leading-relaxed">
                      {about.mission}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F29A1A]/10 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-[#F29A1A]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Notre Vision</h3>
                    <p className="text-xs text-gray-500 mt-1 font-light leading-relaxed">
                      {about.vision}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Corporate core values */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Nos Valeurs Fondamentales</h3>
            <p className="text-xs text-gray-400 font-light">Les principes éthiques et professionnels guidant notre travail quotidien.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {VALUES.map((val) => {
              const IconComp = val.icon;
              return (
                <div key={val.name} className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: val.color }}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{val.name}</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & PROCESS (parallax styled theme) */}
      <section className="bg-slate-950 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Why choose us left list */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F29A1A]">LUMIÈRE SOUVENT CITÉE</span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Pourquoi accorder votre confiance à HINOV Group ?
              </h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Notre structure repose sur une gestion d'excellence et une coordination continue. Voici les engagements qualité appliqués sur chacun de vos projets :
              </p>
              
              <ul className="space-y-3 pt-2">
                {WHY_CHOOS_US.map((item, id) => (
                  <li key={id} className="flex items-center space-x-3 text-xs md:text-sm text-gray-300 font-medium">
                    <CheckCircle className="w-5 h-5 text-[#4CD37E] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step processes right list */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A93D1]">NOTRE WORKFLOW</span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight leid-snug">
                Processus de Collaboration Rigoureux
              </h3>
              
              <div className="relative border-l border-slate-800 pl-6 ml-3 space-y-8 pt-2">
                {COLLABORATION_STEPS.map((step) => (
                  <div key={step.step} className="relative group">
                    {/* Circle wrapper icon number */}
                    <div className="absolute -left-[37px] top-0.5 w-6.5 h-6.5 rounded-full bg-[#111111] border border-slate-700 text-xs font-bold flex items-center justify-center text-gray-300 group-hover:border-[#4A93D1] group-hover:text-white transition-colors">
                      {step.step}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#4A93D1] transition-colors">{step.title}</h4>
                      <p className="text-xs text-gray-400 font-normal leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CUSTOMER PORTFOLIO SHOWCASE LOGO SHIELD & REAL CLIENT TESTIMONIALS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header intro */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ils nous font confiance</h3>
            <p className="text-xs text-gray-500 font-light">
              Des administrations publiques, écoles privées et entreprises s'appuient sur nos solutions informatiques et notre imprimerie au quotidien.
            </p>
          </div>

          {/* Aesthetic fake logos vector row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CLIENTS_LOGOS.map((client) => (
              <div key={client.name} className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center justify-center h-20 shadow-sm hover:shadow-md transition-all group">
                <div className={`text-xs font-bold tracking-tight bg-gradient-to-r ${client.color} bg-clip-text text-transparent uppercase opacity-60 group-hover:opacity-100 transition-opacity`}>
                  ⚡ {client.name}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {TESTIMONIALS.map((test, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative space-y-4">
                <Quote className="w-10 h-10 text-slate-100 absolute top-4 right-4 fill-slate-50" />
                <p className="text-xs md:text-sm text-gray-500 font-light italic leading-relaxed relative z-10">
                  "{test.quote}"
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-xs font-bold text-slate-800 flex items-center justify-center">
                    {test.avatar}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-none">{test.author}</h5>
                    <span className="text-[10px] text-[#4A93D1] font-medium block mt-1">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
