import React from 'react';
import { Mail, Phone, MapPin, Clock, Landmark, Send, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="hinov-company-footer" className="bg-[#111111] text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Intro & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <motion.img 
                src="https://res.cloudinary.com/dzthrix45/image/upload/q_auto/f_auto/v1781601015/IMG-20260612-WA0002_2_gg2vtq.jpg" 
                alt="Logo HINOV Group" 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-800 p-0.5 shadow-md cursor-pointer"
                animate={{ 
                  scale: [1, 1.35, 1, 1],
                  rotate: [0, 180, 360, 360],
                }}
                transition={{ 
                  duration: 5, 
                  ease: "easeInOut",
                  times: [0, 0.3, 0.6, 1],
                  repeat: Infinity
                }}
                whileHover={{ 
                  scale: [1, 1.35, 1.35, 1],
                  rotate: [0, 180, 360, 360],
                  transition: { 
                    duration: 2.4, 
                    ease: "easeInOut",
                    times: [0, 0.35, 0.75, 1]
                  } 
                }}
                whileTap={{ scale: 0.9 }}
              />
              <span className="font-extrabold text-2xl tracking-tight text-white">HINOV <span className="text-[#4A93D1]">Group</span></span>
            </div>
            <p className="text-sm font-medium leading-relaxed mt-2 text-gray-400">
              « Innovons ensemble, un clic à la fois »
            </p>
            <p className="text-xs font-light text-gray-500 leading-relaxed">
              Spécialiste de la transformation digitale, de l'ingénierie informatique, des fournitures professionnelles et de l'imprimerie grand format en Côte d'Ivoire.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://wa.me/2250759813511" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.839.002-2.628-1.02-5.1-2.871-6.955C16.612 1.956 14.15 1.928 11.48 1.928c-5.44 0-9.866 4.414-9.868 9.84-.001 1.838.502 3.633 1.453 5.2l-.993 3.63 3.733-.979s.114.072.252.135z"/></svg>
              </a>
              <button onClick={() => setCurrentTab('contact')} className="w-9 h-9 rounded-lg bg-[#4A93D1]/20 hover:bg-[#4A93D1]/40 text-[#4A93D1] flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick links to sectors */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold uppercase tracking-wider">Nos Activités</h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => setCurrentTab('catalogue-Matériel Informatique')} className="hover:text-white transition-colors text-left font-normal text-gray-400">
                  Solutions & Matériel Informatique
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('catalogue-Supports de Communication')} className="hover:text-white transition-colors text-left font-normal text-gray-400">
                  Imprimerie Offset & Numérique
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('catalogue-Fournitures de Bureau')} className="hover:text-white transition-colors text-left font-normal text-gray-400">
                  Fournitures Scolaires & de Bureau
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('catalogue-Textile Personnalisé')} className="hover:text-white transition-colors text-left font-normal text-gray-400">
                  Textile & Vêtements Professionnels
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('catalogue-Objets Publicitaires')} className="hover:text-white transition-colors text-left font-normal text-gray-400">
                  Branding & Objets Publicitaires
                </button>
              </li>
            </ul>
          </div>

          {/* Opening hours & contact card */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold uppercase tracking-wider">Infos Pratiques</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#F29A1A] shrink-0 mt-0.5" />
                <span>Abidjan Yopougon cité CIE rue S 259<br />Côte d'Ivoire</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#4CD37E] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:+2252723227992" className="hover:text-white transition-colors text-xs font-semibold">+(225) 27 23 227 992</a>
                  <a href="tel:+2250759813511" className="hover:text-white transition-colors text-xs font-semibold">+(225) 07 59 81 35 11</a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#4A93D1] shrink-0" />
                <a href="mailto:hinovgroup@hinovgroup.com" className="hover:text-white transition-colors">hinovgroup@hinovgroup.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#C83AB3] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 leading-relaxed font-normal">
                  <strong className="text-gray-200">Lun - Ven :</strong> 08h00 - 18h00<br />
                  <strong className="text-gray-200">Sam :</strong> 09h00 - 13h00<br />
                  <strong className="text-gray-200">Dimanche :</strong> Fermé
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold uppercase tracking-wider">Restez Informé</h3>
            <p className="text-xs font-light text-gray-500 leading-relaxed">
              Souscrivez à notre lettre d'information pour recevoir nos arrivages de matériel informatique et de fournitures scolaires en avant-première.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Merci pour votre inscription à notre newsletter !"); }} className="space-y-2">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="Votre adresse email..." 
                  className="w-full bg-[#1b1b1b] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#4A93D1] focus:ring-1 focus:ring-[#4A93D1] transition-all"
                />
                <button type="submit" className="absolute right-1 text-white top-1 bg-[#4A93D1] hover:bg-[#4A93D1]/80 transition-colors py-2 px-3.5 rounded-lg text-xs font-medium cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-500 font-semibold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Conforme RGPD / Côte d'Ivoire</span>
            </div>
          </div>

        </div>

        {/* Brand Bottom segment */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p className="text-center md:text-left">
            &copy; {currentYear} <strong className="text-gray-400">HINOV Group</strong>. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <button onClick={() => setCurrentTab('apropos')} className="hover:text-white transition-colors">Notre Entreprise</button>
            <button onClick={() => setCurrentTab('contact')} className="hover:text-white transition-colors">Support Commercial</button>
            <span className="text-gray-700">|</span>
            <span className="text-[#F29A1A] font-semibold">« Innovons ensemble, un clic à la fois »</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
