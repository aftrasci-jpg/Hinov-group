import React, { useState } from 'react';
import { Menu, X, Landmark, Layers, Briefcase, FileText, Phone, Settings, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onAdminClick: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: Landmark },
    { id: 'apropos', label: 'À Propos', icon: Layers },
    { id: 'catalogue', label: 'Catalogue', icon: Briefcase, hasDropdown: true },
    { id: 'realisations', label: 'Réalisations', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    setShowCatalogDropdown(false);
  };

  return (
    <nav id="hinov-main-navbar" className="bg-white border-b border-gray-100 sticky top-0 z-[100] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <button 
              id="hinov-logo-button"
              onClick={() => handleTabChange('accueil')} 
              className="flex items-center space-x-3 cursor-pointer group focus:outline-none"
            >
              {/* HINOV Official Logo Image */}
              <motion.img 
                src="https://res.cloudinary.com/dzthrix45/image/upload/q_auto/f_auto/v1781601015/IMG-20260612-WA0002_2_gg2vtq.jpg" 
                alt="Logo HINOV Group" 
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-contain shadow-sm bg-white border border-gray-100 animate-none"
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
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-[#4A93D1] transition-colors leading-none">HINOV</span>
                <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">GROUP</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'catalogue' && currentTab.startsWith('cat-'));
              
              if (item.hasDropdown) {
                return (
                  <div 
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setShowCatalogDropdown(true)}
                    onMouseLeave={() => setShowCatalogDropdown(false)}
                  >
                    <button
                      id={`nav-item-${item.id}`}
                      onClick={() => handleTabChange('catalogue')}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#4A93D1]/10 text-[#4A93D1]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="ml-1.5 h-4 w-4" />
                    </button>

                    {showCatalogDropdown && (
                      <div id="catalog-dropdown-menu" className="absolute left-0 mt-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-[110] animate-fade-in">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rayons de vente</p>
                        </div>
                        {[
                          "Matériel Informatique",
                          "Fournitures de Bureau",
                          "Fournitures Scolaires",
                          "Objets Publicitaires",
                          "Textile Personnalisé",
                          "Supports de Communication"
                        ].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setCurrentTab(`catalogue-${cat}`);
                              setShowCatalogDropdown(false);
                            }}
                            className="w-full text-left px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-slate-50 hover:text-[#4A93D1] transition-colors flex items-center"
                          >
                            <span className="w-2 h-2 rounded-full mr-3.5" style={{
                              backgroundColor: 
                                cat.includes('Info') ? '#4A93D1' : 
                                cat.includes('Bureau') ? '#F29A1A' : 
                                cat.includes('Scolai') ? '#4CD37E' : 
                                cat.includes('Publicit') ? '#C83AB3' : 
                                cat.includes('Textile') ? '#111111' : '#4A93D1'
                            }} />
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleTabChange(item.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#4A93D1]/10 text-[#4A93D1]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Admin Console Shortcut */}
            <button
              id="nav-admin-button"
              onClick={onAdminClick}
              className={`p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#F29A1A] transition-all cursor-pointer ${
                currentTab === 'admin' ? 'bg-[#F29A1A]/10 text-[#F29A1A]' : ''
              }`}
              title="Console Admin HINOV"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              id="nav-admin-mobile-shortcut"
              onClick={onAdminClick}
              className="mr-2 p-2 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              id="mobile-menu-burger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-navigation-pane" className="md:hidden bg-white border-b border-gray-100 animate-slide-down">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'catalogue' && currentTab.startsWith('catalogue-'));
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-base font-bold cursor-pointer ${
                      isActive
                        ? 'bg-[#4A93D1]/10 text-[#4A93D1]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>

                  {item.id === 'catalogue' && (
                    <div className="pl-6 pr-4 py-1 space-y-1 bg-gray-50/50 rounded-xl mt-1 mx-2">
                      {[
                        "Matériel Informatique",
                        "Fournitures de Bureau",
                        "Fournitures Scolaires",
                        "Objets Publicitaires",
                        "Textile Personnalisé",
                        "Supports de Communication"
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleTabChange(`catalogue-${cat}`)}
                          className="w-full text-left py-2.5 text-xs text-gray-600 hover:text-[#4A93D1] block"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
