import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, Calendar, Compass, HelpCircle, Check, Star } from 'lucide-react';
import { addDevisRequest } from '../firebase';

interface ContactProps {
  onSuccessMessage: (msg: string) => void;
}

export default function Contact({ onSuccessMessage }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDevisRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      onSuccessMessage("Votre message et votre demande ont été transmis à HINOV Group avec succès. Un conseiller technique reviendra vers vous sous 24h !");
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (e) {
      console.error(e);
      alert("Une erreur inattendue est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="hinov-contact-and-quote-page" className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111111]/5 text-slate-800 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-[#F29A1A]" />
            <span>Prenez Contact</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Prêt à lancer votre projet ?
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Que ce soit pour l'installation d'une infrastructure réseau informatique, l'achat en gros de fournitures scolaires, l'impression de bâches publicitaires ou une demande de textile personnalisé, nos conseillers sont à votre écoute.
          </p>
        </div>

        {/* Content main grid columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel - Info coords & SVG map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-950 text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              {/* Abs decoration light circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4A93D1]/20 to-transparent rounded-full filter blur-xl" />
              
              <h3 className="text-xl font-extrabold tracking-tight">HINOV Group Siège</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Notre agence principale vous accueille à Abidjan pour étudier votre cahier des charges de communication visuelle et de matériel.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#F29A1A]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Visiter nos bureaux</span>
                    <strong className="text-slate-100 text-sm font-bold">Abidjan Yopougon cité CIE rue S 259</strong>
                    <p className="text-xs text-gray-400 mt-0.5">Côte d'Ivoire</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#4CD37E]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Téléphones commerciaux</span>
                    <div className="flex flex-col space-y-1">
                      <a href="tel:+2252723227992" className="text-slate-100 text-sm font-semibold hover:text-[#4A93D1] transition-colors">
                        +(225) 27 23 227 992
                      </a>
                      <a href="tel:+2250759813511" className="text-slate-100 text-sm font-semibold hover:text-[#4A93D1] transition-colors">
                        +(225) 07 59 81 35 11
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Soutien WhatsApp direct disponible sur la ligne mobile</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#4A93D1]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Email professionnel</span>
                    <a href="mailto:hinovgroup@hinovgroup.com" className="text-slate-100 text-sm font-semibold hover:text-[#4A93D1] transition-colors">
                      hinovgroup@hinovgroup.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#C83AB3]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Horaires de réception</span>
                    <p className="text-xs text-slate-100 font-semibold leading-relaxed">
                      Lundi - Vendredi : 08h00 - 18h00<br />
                      Samedi : 09h00 - 13h00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium stylized vector map of Yopougon Abidjan */}
            <div id="vector-map-panel" className="bg-slate-50 border border-gray-100 rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <Compass className="w-4 h-4 text-[#4A93D1]" />
                <span>Plan de géolocalisation HINOV</span>
              </h4>
              
              {/* Dynamic stylized map built entirely of SVG vectors */}
              <div className="relative w-full aspect-video bg-[#111111] overflow-hidden rounded-2xl border border-gray-800 flex flex-col justify-between p-4">
                
                {/* SVG decorative roads and regions representation of Abidjan */}
                <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 200" fill="none">
                  {/* Outer lagoon body */}
                  <path d="M 0 160 Q 150 140 280 180 T 400 130 L 400 200 L 0 200 Z" fill="#1e293b" opacity="0.4" />
                  <path d="M 0 160 Q 150 140 280 180 T 400 130" stroke="#4A93D1" strokeWidth="4" />
                  
                  {/* Grid roads network */}
                  <line x1="50" y1="0" x2="60" y2="200" stroke="#334155" strokeWidth="1.5" />
                  <line x1="150" y1="0" x2="180" y2="200" stroke="#334155" strokeWidth="1.5" />
                  <line x1="280" y1="0" x2="260" y2="200" stroke="#334155" strokeWidth="2.5" />
                  
                  {/* Horizontal highways */}
                  <path d="M 0 40 H 400" stroke="#334155" strokeWidth="3" />
                  <path d="M 0 110 Q 180 80 400 110" stroke="#475569" strokeWidth="5" />
                  
                  {/* Star point representing Cocody, Plateau, Yopougon */}
                  <text x="310" y="80" fill="#94a3b8" fontSize="8" fontWeight="bold">Cocody</text>
                  <text x="210" y="140" fill="#94a3b8" fontSize="8" fontWeight="bold">Plateau</text>
                  <text x="70" y="70" fill="#f8fafc" fontSize="9" fontWeight="extrabold">YOPOUGON (Cité CIE)</text>
                </svg>

                {/* Pulsing indicator representing HINOV Group offices */}
                <div className="absolute left-[110px] top-[75px] z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -inset-1.5 rounded-full bg-[#F29A1A] animate-ping opacity-75" />
                    <div className="w-5.5 h-5.5 rounded-full bg-slate-900 border-2 border-[#F29A1A] flex items-center justify-center text-[#F29A1A]">
                      <Star className="w-3 h-3 fill-[#F29A1A]" />
                    </div>
                  </div>
                  <div className="bg-slate-950/90 text-[8px] font-black uppercase text-[#F29A1A] px-2 py-0.5 rounded border border-[#F29A1A]/30 mt-1 shadow-md">
                    Hinov H.Q.
                  </div>
                </div>

                <div className="relative z-10 mt-auto bg-black/60 backdrop-blur-sm p-3.5 rounded-xl border border-white/5 space-y-1 w-max">
                  <p className="text-[10px] font-bold text-white leading-none">Abidjan - Côte d'Ivoire</p>
                  <p className="text-[8px] text-gray-300">Yopougon, non loin du château d'eau de la Cité CIE.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Dynamic Message contact form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Soumettre une demande</h3>
                <p className="text-xs text-gray-500 font-light mt-1">
                  Tous les champs marqués d’un astérisque (*) sont obligatoires pour un traitement valide de votre dossier.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Votre Nom Complet *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Kouamé Koffi Serge" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Votre Téléphone Mobile *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ex: +225 07 48..." 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Adresse Email Professionnelle *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Ex: direction@votreentreprise.ci" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Objet de la demande *</label>
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all text-gray-700 cursor-pointer"
                  >
                    <option value="">Sélectionnez un sujet clé de projet...</option>
                    <option value="Achat matériel informatique et réseaux">Solutions & Matériels Informatiques</option>
                    <option value="Création de site web ou application">Développements Web & Communication</option>
                    <option value="Travaux d'imprimerie grand format">Impression Offset & Imprimerie Numérique</option>
                    <option value="Personnalisation textile et objets publicitaires">Goodies, Cadeaux & Textiles Personnalisés</option>
                    <option value="Achat groupé de fournitures de bureau / école">Fournitures Scolaires & Bureautiques en gros</option>
                    <option value="Autre demande de devis">Autre demande de devis</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Message / Descriptif détaillé *</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Désignez de manière précise vos spécifications : tailles, caractéristiques techniques, volumes à imprimer, délais de livraison souhaités..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all font-light"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl py-4 text-xs font-bold transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-lg shadow-[#4A93D1]/10"
                >
                  {submitting ? (
                    <span>Transmission sécurisée...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmettre ma demande à HINOV</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
